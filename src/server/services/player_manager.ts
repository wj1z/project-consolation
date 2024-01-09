import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events } from "server/networking";

@Service()
export class PlayerManagerService implements OnStart {
    onStart(): void {
        Players.PlayerAdded.Connect(player => this._player_added(player));

        Events.look_at.connect((player, camera_dir) => this._replicate_look_at(player, camera_dir))
    }

    private _player_added(player: Player): void {
        if (player.Character !== undefined) {
            this._character_added(player.Character);
        }

        player.CharacterAdded.Connect(character => this._character_added(character));
    }

    private _character_added(character: Model): void {
        character.AddTag("Character");
    }

    private _replicate_look_at(player: Player, camera_dir: Vector3): void {
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