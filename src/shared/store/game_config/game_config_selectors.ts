import { SharedState } from "..";

export const select_game_state = (state: SharedState) => state.game_config.game_state;

export const select_typewriter_text = (state: SharedState) => state.game_config.typewriter.text;
export const select_typewriter_is_animated = (state: SharedState) => state.game_config.typewriter.is_animated;

export const select_gamemode = (state: SharedState) => state.game_config.gamemode;

export const select_active_players = (state: SharedState) => state.game_config.active_players;