import { Controller, OnStart } from "@flamework/core";
import CameraShaker from "@rbxts/camera-shaker";
import { CollectionService, Workspace } from "@rbxts/services";
import { Events } from "client/networking";
import CameraShakes, { CameraShakePreset } from "shared/config/camera_shakes";
import { play_audio, play_audio_randomly } from "shared/util/audio";

@Controller({
    loadOrder: 0
})
export class CameraController implements OnStart {
    private camera = Workspace.CurrentCamera as Camera;
    private camera_shaker = new CameraShaker(
        Enum.RenderPriority.Last.Value,
        shake_cf => this.camera.CFrame = this.camera.CFrame.mul(shake_cf)
    );

    onStart(): void {
        this.camera_shaker.Start();

        Events.cycle_camera.connect(
            () => this._cycle_camera()
        );
        Events.shake_camera.connect(
            (camera_shake_preset) =>
            this.shake_camera(camera_shake_preset)
        );
    }

    shake_camera(camera_shake_preset: CameraShakePreset): void {
        this.camera_shaker.ShakeOnce(
            camera_shake_preset.magnitude,
            camera_shake_preset.roughness,
            camera_shake_preset.fade_in_time,
            camera_shake_preset.fade_out_time,
            new Vector3(1, 1, 1),
            new Vector3(0, 0, 0)
        );
    }

    private _get_last_cam_props(): [CFrame, Enum.CameraType] {
        const [last_cam_cframe, last_cam_type] = [this.camera.CFrame, this.camera.CameraType];
        return [last_cam_cframe, last_cam_type];
    }

    private _lock_to(target: BasePart): void {
        this.camera.CameraType = Enum.CameraType.Scriptable;
        this.camera.CFrame = target.CFrame;
    }

    private _cycle_camera(): void {
        const [last_cam_cframe, last_cam_type] = this._get_last_cam_props();

        const cycle_points = CollectionService.GetTagged("CyclePoint") as BasePart[];
        for (const cycle_point of cycle_points) {
            this._lock_to(cycle_point);
            this.shake_camera(CameraShakes.cycle);
            play_audio_randomly("camera");
            
            Promise.delay(1.5).await();
        }

        this.camera.CFrame = last_cam_cframe;
        this.camera.CameraType = last_cam_type;
    }
}