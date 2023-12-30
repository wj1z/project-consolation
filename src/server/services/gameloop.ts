import { OnStart, Service } from "@flamework/core";
import { TypewriterService } from "./typewriter";
import { Players } from "@rbxts/services";
import ServerConfig from "server/config/server";
import TypewriterConfig, { select_random } from "server/config/typewriter";
import { store } from "server/store";
import { GameState } from "shared/store/game_config";

@Service({
    loadOrder: 0
})
export class GameloopService implements OnStart {
    private _current_state: () => Promise<any> = () => this._wait_for_players();

    private _is_enough_players = () => Players.GetPlayers().size() >= ServerConfig.MIN_PLAYERS;
    private _is_not_enough_players = () => Players.GetPlayers().size() - 1 < ServerConfig.MIN_PLAYERS;

    private _write = (text: string, is_animated?: boolean) => this.typewriter.write(text, is_animated);
    private _set_game_state = (game_state: GameState) => store.set_game_state(game_state);

    private async _enough_players(): Promise<Player | void> {
        if (this._is_enough_players()) return Promise.resolve();

        const write_player_amount = () => this._write(
            TypewriterConfig.WaitingForPlayers(Players.GetPlayers().size(), ServerConfig.MIN_PLAYERS)
        );
        write_player_amount();

        return Promise.fromEvent(Players.PlayerAdded, () => {
            write_player_amount();
            return this._is_enough_players()
        });
    }
    private async _not_enough_players(): Promise<Player | void> {
        if (!this._is_enough_players()) return Promise.resolve();

        return Promise.fromEvent(Players.PlayerRemoving,
            () => this._is_not_enough_players()
        );
    }

    constructor (
        private typewriter: TypewriterService
    ) {}

    onStart(): void {
        while (true) {
            this._game_loop();
        }
    }

    private _game_loop(): void {
        const current_state = this._current_state();
        this._current_state = current_state.expect();
    }

    private async _wait_for_players(): Promise<any> {
        this._set_game_state(GameState.Intermission);

        return this._enough_players().andThenReturn(
            () => this._intermission()
        );
    }

    private async _intermission(): Promise<any> {
        return Promise.race([
            this._not_enough_players()
            .andThenReturn(
                () => this._wait_for_players()
            ),

            new Promise((resolve, _, on_cancel) => {
                const tick = os.clock();
                const time_left = () => ServerConfig.INTERMISSION_TIME - (os.clock() - tick);

                while (time_left() >= 0) {
                    if (on_cancel()) return;

                    this._write(
                        TypewriterConfig.Intermission(math.ceil(time_left()))
                    );

                    Promise.delay(0).await();
                }

                resolve(undefined);
            })
            .andThenCall(() => {
                this._set_game_state(GameState.Running);
                this._write(TypewriterConfig.Welcome, true);
            })
            .andThenCall(Promise.delay, 2)
            .andThenCall(
                () => this._write(select_random(TypewriterConfig.Prelude), true)
            )
            .andThenCall(Promise.delay, 2)
            .andThenReturn(
                () => this._start_round()
            )
        ]);
    }

    private async _start_round(): Promise<any> {
        this._write("Started.", true);

        return Promise.race([
            this._not_enough_players()
            .andThenReturn(
                () => this._all_players_left()
            ),

            Promise.delay(5)
            .andThenReturn(
                () => this._cleanup()
            )
        ]);
    }

    private async _all_players_left(): Promise<any> {
        return Promise.resolve()
        .andThenCall(
            () => this._write(TypewriterConfig.PlayerLeft, true)
        )
        .andThenCall(Promise.delay, 3)
        .andThenReturn(
            () => this._cleanup()
        );
    }

    private async _cleanup(): Promise<any> {
        this._write(TypewriterConfig.Cleanup, true);

        return Promise.delay(2)
        .andThenCall(
            () => {
                this._set_game_state(GameState.Intermission);
                this._write("on_cleanup_test");

                for (const player of Players.GetPlayers()) {
                    Promise.try(() => player.LoadCharacter());
                }
            }
        )
        .andThenCall(Promise.delay, 2)
        .andThenReturn(
            () => this._wait_for_players()
        );
    }
}