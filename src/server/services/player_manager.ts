import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import ServerConfig from "server/config/server";
import { store } from "server/store";

@Service()
export default class PlayerManagerService implements OnStart {
    onStart(): void {
        Players.PlayerAdded.Connect(player => this._player_added(player));
    }

    _is_enough_players = () => Players.GetPlayers().size() >= ServerConfig.min_players;
    _is_not_enough_players = () => Players.GetPlayers().size() - 1 < ServerConfig.min_players;

    fill_active_players(): void {
        const active_players = Players.GetPlayers();
        store.set_active_players(active_players);
    }

    clear_active_players(): void {
        store.reset_active_players();
    }

    private _player_added(player: Player): void {
        if (player.Character !== undefined) this._character_added(player.Character);

        player.CharacterAdded.Connect(character => this._character_added(character));
    }

    private _character_added(character: Model): void {
        character.AddTag("Character");
    }
}