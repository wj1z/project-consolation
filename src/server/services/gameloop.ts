import { Players } from "@rbxts/services";
import { OnStart, Service } from "@flamework/core";
import TypewriterService from "./typewriter";
import PlayerManagerService from "./player_manager";
import GameManagerService from "./game_manager";
import ServerConfig from "server/config/server";
import TypewriterConfig, { select_random } from "server/config/typewriter";
import { store } from "server/store";
import { GameState } from "shared/store/game_config";
import { Events } from "server/networking";
import { select_game_state, select_gamemode } from "shared/store/game_config/game_config_selectors";
import CameraShakes, { CameraShakePreset } from "shared/config/camera_shakes";
import { play_audio } from "shared/util/audio";

@Service({
    loadOrder: 0
})
class GameloopService implements OnStart {
    private _current_state: () => Promise<any> = () => this._wait_for_players();

    private _write = (text: string, is_animated?: boolean) => this.typewriter.write(text, is_animated);
    private _shake = (preset: CameraShakePreset) => Events.shake_camera.broadcast(preset);

    constructor (
        private typewriter: TypewriterService,
        private player_manager: PlayerManagerService,
        private game_manager: GameManagerService
    ) {}

    onStart(): void {
        while (true) this._game_loop();
    }

    private _game_loop(): void {
        const current_state = this._current_state();
        this._current_state = current_state.expect();
    }

    private _startup_game = () => {
        this.game_manager.startup_game();
        
        this._shake(CameraShakes.startup);
    }

    private _pre_restart = () => {
        this.game_manager.pre_restart();

        this._shake(CameraShakes.pre_restart);
        play_audio("glass_break");
    }

    private _restart_game = () => {
        this._shake(CameraShakes.restart);
        play_audio("restart");

        return this._wait_for_players();
    }

    private async _enough_players(): Promise<Player | void> {
        if (this.player_manager._is_enough_players()) return Promise.resolve();
        const game_state = store.getState(select_game_state);

        const write_player_amount = () => this._write(
            TypewriterConfig.waiting_for_players(Players.GetPlayers().size(), ServerConfig.min_players)
        );
        if (game_state === GameState.WaitingForPlayers) write_player_amount();

        return Promise.fromEvent(Players.PlayerAdded, () => {
            if (game_state === GameState.WaitingForPlayers) write_player_amount();

            return this.player_manager._is_enough_players();
        });
    }

    private async _not_enough_players(active: boolean = false): Promise<Player | void> {
        if (!this.player_manager._is_enough_players(active)) return Promise.resolve();

        return Promise.fromEvent(Players.PlayerRemoving,
            () => this.player_manager._is_not_enough_players(active)
        );
    }

    private async _wait_for_players(): Promise<any> {
        this.game_manager.set_game_state(GameState.WaitingForPlayers);

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
                this.game_manager.set_game_state(GameState.Intermission);

                const tick = os.clock();

                const time_left = () => ServerConfig.intermission_time - (os.clock() - tick);
                let last_time_left = time_left();

                while (time_left() >= 0) {
                    if (on_cancel()) return;

                    const time_left_rounded = math.ceil(time_left());
                    this._write(
                        TypewriterConfig.intermission(time_left_rounded)
                    );

                    if (time_left_rounded < last_time_left) {
                        last_time_left = time_left();
                        play_audio("time");
                    }

                    Promise.delay(0).await();
                }

                resolve(undefined);
            })
            .andThenCall(() => {
                this._startup_game();
                this._write(select_random(TypewriterConfig.prelude), true);
            })
            .andThenCall(Promise.delay, 4)
            .andThenCall(() => {
                const gamemode = store.getState(select_gamemode);
                this._write(TypewriterConfig.gamemode[gamemode], true);

                Promise.delay(1).andThenCall(
                    () => Events.cycle_camera.broadcast()
                );
            })
            .andThenCall(Promise.delay, 6)
            .andThenReturn(
                () => this._start_round()
            )
        ]);
    }

    private async _start_round(): Promise<any> {
        const gamemode = store.getState(select_gamemode);

        const [real_bullets, fake_bullets] = this.game_manager.select_bullets();

        return Promise.race([
            this._not_enough_players(true)
            .andThenReturn(
                () => this._all_players_left()
            ),

            this.game_manager.start_timer()
            .andThenReturn(
                () => this._timeout()
            ),

            new Promise(
                (resolve) => {
                    resolve(this._write(TypewriterConfig.start[gamemode](real_bullets, fake_bullets), true));
                }
            )
            .andThenCall(Promise.delay, 30)
            .andThenReturn(
                () => this._cleanup()
            )
        ]);
    }

    private async _winner_left(winner: Player): Promise<any> {
        return new Promise(
            (resolve) => resolve(this._write(TypewriterConfig.winner(winner.DisplayName), true))
        )
        .andThenCall(Promise.delay, 3)
        .andThenReturn(
            () => this._cleanup()
        );
    }

    private async _all_players_left(): Promise<any> {
        return new Promise(
            (resolve) => resolve(this._write(TypewriterConfig.no_players_left, true))
        )
        .andThenCall(Promise.delay, 3)
        .andThenReturn(
            () => this._cleanup()
        );
    }

    private async _timeout(): Promise<any> {
        return new Promise(
            (resolve) => resolve(this._write(TypewriterConfig.timeout, true))
        )
        .andThenCall(Promise.delay, 3)
        .andThenReturn(
            () => this._cleanup()
        );
    }

    private async _cleanup(): Promise<any> {
        this._write(TypewriterConfig.cleanup, true);

        return Promise.delay(2)
        .andThenCall(
            () => this._pre_restart()
        )
        .andThenCall(Promise.delay, 2)
        .andThenReturn(
            () => this._restart_game()
        );
    }
}