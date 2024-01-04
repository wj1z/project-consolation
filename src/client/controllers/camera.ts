import { Controller, OnStart } from "@flamework/core";
import { CollectionService, Workspace } from "@rbxts/services";
import { Events } from "client/networking";
import PlayAudio from "shared/util/audio";

@Controller({
    loadOrder: 0
})
export class CameraController implements OnStart {
    private camera: Camera = Workspace.CurrentCamera as Camera;

    onStart(): void {
        Events.cycle_camera.connect(
            () => this._cycle_camera()
        );
    }

    private _cycle_camera(): void {
        const last_cam_cframe = this.camera.CFrame;
        const last_cam_type = this.camera.CameraType;

        const cycle_points = CollectionService.GetTagged("CyclePoint") as BasePart[];
        const cycle_once = (cycle_point: BasePart) => {
            this.camera.CFrame = cycle_point.CFrame;
            PlayAudio("camera");
        };

        this.camera.CameraType = Enum.CameraType.Scriptable;
        for (const cycle_point of cycle_points) {
            cycle_once(cycle_point);
            Promise.delay(1).await();
        }

        this.camera.CFrame = last_cam_cframe;
        this.camera.CameraType = last_cam_type;
    }
}