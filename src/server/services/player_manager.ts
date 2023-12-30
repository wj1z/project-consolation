import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";

@Service()
export class PlayerManagerService implements OnStart {
    onStart(): void {
        Players.PlayerAdded.Connect(player => this._player_added(player));
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
}