import { BaseComponent, Component } from "@flamework/components";
import { CharacterInstance } from "../character";
import { Players, TweenService, Workspace } from "@rbxts/services";
import { OnRender, OnStart } from "@flamework/core";
import { Events } from "client/networking";

export const local_predicate = (instance: Instance) => {
    const player = Players.LocalPlayer;
    const character = player.Character;
    
    if (character === undefined || character.IsDescendantOf(Workspace) === false) {
        player.CharacterAdded.Wait();
    }

    return Players.GetPlayerFromCharacter(instance) === player;
}

@Component({
    tag: "Character",
    predicate: local_predicate
})
class LocalCharacter extends BaseComponent<{}, CharacterInstance> implements OnStart, OnRender {
    private head = this.instance.Head;
    private humanoid = this.instance.Humanoid;
    private root_part = this.instance.HumanoidRootPart;

    private camera = Workspace.CurrentCamera as Camera;

    private head_replication_tick = 0;

    onStart(): void {
        Events.looked_at.connect(
            (character, camera_dir) => character.SetAttribute("CameraDirection", camera_dir)
        );
    }

    onRender(dt: number): void {
		dt = math.min(dt * 60, 1);

        if (this.camera.CameraType === Enum.CameraType.Custom) {
            this._rotate_head();
		    this._set_camera_offset(dt);
        }
    }

    private _rotate_head(): void {
        const camera_dir = this.root_part.CFrame.ToObjectSpace(this.camera.CFrame).LookVector.Unit;
        this.instance.SetAttribute("CameraDirection", camera_dir);

        const NECK_REPLICATION_DELAY = 1/8;
        if (os.clock() - this.head_replication_tick >= NECK_REPLICATION_DELAY) {
            this.head_replication_tick = os.clock();
            Events.look_at(camera_dir);
        }
    }

    private _set_camera_offset(dt: number, offset_alpha: number = 0.15): void {
		const offset_vector = this.root_part.CFrame.mul(new CFrame(0, 1, 0)).PointToObjectSpace(this.head.Position);
		this.humanoid.CameraOffset = this.humanoid.CameraOffset.Lerp(offset_vector, offset_alpha * dt);
    }
}