import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";

@Service({
    loadOrder: 0
})
export class PlayerManagerService implements OnStart {
    onStart(): void {
        Players.PlayerAdded.Connect(player => this.player_added(player));
    }

    player_added(player: Player): void {
        if (player.Character !== undefined) {
            this.character_added(player.Character);
        }

        player.CharacterAdded.Connect(character => this.character_added(character));
    }

    character_added(character: Model): void {
        character.AddTag("Character");
    }
}