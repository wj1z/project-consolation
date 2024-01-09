import { OnStart, Service } from "@flamework/core";
import { Events } from "server/networking";

@Service()
class EventManagerService implements OnStart {
    onStart(): void {
        Events.look_at.connect((player, camera_dir) => this._look_at(player, camera_dir));
    }

    private _look_at(player: Player, camera_dir: Vector3): void {
        assert(typeIs(camera_dir, "Vector3"), "Invalid camera_dir type.");
        assert(camera_dir.Magnitude < 1.5, "Invalid camera_dir magnitude.");

        const character = player.Character;
        assert(character !== undefined, "Invalid character.");

        const humanoid = character.FindFirstChildOfClass("Humanoid");
        assert(humanoid !== undefined && humanoid.GetState() !== Enum.HumanoidStateType.Dead, "Invalid or Dead humanoid.");

        const torso = character.FindFirstChild("Torso");
        assert(torso !== undefined, "Invalid torso.");

        const neck = torso.FindFirstChild("Neck");
        assert(neck !== undefined, "Invalid neck.");

        Events.looked_at.except(player, character, camera_dir);
    }
}