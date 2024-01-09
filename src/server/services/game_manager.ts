import { Service } from "@flamework/core";
import { Events } from "server/networking";
import { store } from "server/store";
import { GameState, Gamemode } from "shared/store/game_config";

@Service()
export default class GameManagerService {
    set_game_state(game_state: GameState): void {
        store.set_game_state(game_state);
    }

    set_gamemode(gamemode: Gamemode): void {
        store.set_gamemode(gamemode);
        Events.gamemode_reveal.broadcast(gamemode);
    }
}