import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import ServerConfig from "server/config/server";
import { store } from "server/store";
import { select_active_players } from "shared/store/game_config/game_config_selectors";

@Service()
export default class PlayerManagerService implements OnStart {
    onStart(): void {
        Players.PlayerAdded.Connect(player => this._player_added(player));
        Players.PlayerRemoving.Connect(player => this._player_removing(player));
    }

    _is_enough_players = (active: boolean = false) => {
        return active
            ? (store.getState(select_active_players).size() > ServerConfig.min_active_players)
            : (Players.GetPlayers().size() >= ServerConfig.min_players);
    }
    _is_not_enough_players = (active: boolean = false) => {
        return active
            ? (store.getState(select_active_players).size() - 1 <= ServerConfig.min_active_players)
            : (Players.GetPlayers().size() > ServerConfig.min_players);
    }

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

    private _player_removing(player: Player): void {
        const active_players = store.getState(select_active_players);

        const player_index = active_players.indexOf(player);
        if (player_index >= 0) {
            active_players.remove(player_index);
        }
    }

    private _character_added(character: Model): void {
        character.AddTag("Character");
    }
}