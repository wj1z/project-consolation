import { createProducer } from "@rbxts/reflex";

export interface GameConfig {
    readonly game_state: GameState,

    readonly typewriter: Typewriter
}

export const enum GameState {
    Intermission,
    Running
}
export type Typewriter = {
    readonly text: string,
    readonly is_animated: boolean
}

const initial_state: GameConfig = {
    game_state: GameState.Intermission,
    typewriter: {
        text: "",
        is_animated: false
    }
};

export const game_config = createProducer(initial_state, {
    set_game_state: (state, game_state: GameState) => ({
        ...state,
        game_state
    }),
    set_typewriter_text: (state, text: string) => ({
        ...state,
        typewriter: {
            text,
            is_animated: state.typewriter.is_animated
        }
    }),
    set_typewriter_is_animated: (state, is_animated: boolean) => ({
        ...state,
        typewriter: {
            text: state.typewriter.text,
            is_animated
        }
    })
});