import { BaseComponent, Component } from "@flamework/components";
import { OnRender } from "@flamework/core";

export interface CharacterInstance extends Model {
    Head: Part,
    Torso: Part & {
        Neck: Motor6D
    },
    Humanoid: Humanoid & {
        Animator: Animator
    },
    HumanoidRootPart: Part
}

@Component({
    tag: "Character"
})
class Character extends BaseComponent<{}, CharacterInstance> implements OnRender {
    private neck = this.instance.Torso.Neck;

    onRender(dt: number): void {
        dt = math.min(dt * 60, 1);

        this._rotate_head(dt);
    }

    private _rotate_head(dt: number, rotation_alpha: number = 0.15): void {
        const camera_dir = this.instance.GetAttribute("CameraDirection") as Vector3;
        if (camera_dir === undefined) {
            return;
        }

        const neck_cframe = new CFrame(this.neck.C0.Position).mul(
            CFrame.Angles(0, -math.asin(camera_dir.X), 0).mul(
                CFrame.Angles(-math.pi / 2 + math.asin(camera_dir.Y), 0, math.pi)
            )
        );
        this.neck.C0 = this.neck.C0.Lerp(neck_cframe, rotation_alpha*dt);
    }
}