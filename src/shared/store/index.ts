import { CombineStates } from "@rbxts/reflex";
import { game_config } from "./game_config";

export type SharedState = CombineStates<typeof shared_slices>;

export const shared_slices = {
    game_config
}