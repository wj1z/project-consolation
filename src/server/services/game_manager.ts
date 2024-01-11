import { Service } from "@flamework/core";
import ServerConfig from "server/config/server";
import { Events } from "server/networking";
import { store } from "server/store";
import { GameState, Gamemode } from "shared/store/game_config";
import { select_active_players, select_time_left } from "shared/store/game_config/game_config_selectors";
import PlayerManagerService from "./player_manager";
import { Players } from "@rbxts/services";

@Service()
export default class GameManagerService {
    constructor(
        private player_manager: PlayerManagerService
    ) {}

    startup_game(): void {
        this.player_manager.fill_active_players();
        store.set_time_left(ServerConfig.round_time);
        this.set_gamemode(Gamemode.Classic);
        this.set_game_state(GameState.Running);
    }

    pre_restart(): void {
        this.set_game_state(GameState.CleaningUp);
        this.player_manager.clear_active_players();

        for (const player of Players.GetPlayers()) {
            Promise.try(() => player.LoadCharacter());
        }
    }

    set_game_state(game_state: GameState): void {
        store.set_game_state(game_state);
    }

    set_gamemode(gamemode: Gamemode): void {
        store.set_gamemode(gamemode);
        Events.gamemode_reveal.broadcast(gamemode);
    }

    select_bullets(): [number, number] {
        const player_amount = store.getState(select_active_players).size();
        
        const real_bullets = new Random().NextInteger(1, math.max(math.floor(player_amount / 2), 1));
        const fake_bullets = math.max(player_amount - real_bullets, 1);

        return [real_bullets, fake_bullets];
    }

    async start_timer(): Promise<undefined> {
        return new Promise(
            (resolve, _, on_cancel) => {
                const set_time = (time: number) => store.set_time_left(time);
                const get_time = () => store.getState(select_time_left);

                while (get_time() > 0) {
                    Promise.delay(1).await();
                    if (on_cancel()) break;

                    set_time(get_time() - 1);
                }
                resolve(undefined);
            }
        );
    }
}