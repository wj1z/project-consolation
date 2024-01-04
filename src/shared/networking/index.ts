import { Networking } from "@flamework/networking";
import { BroadcastAction } from "@rbxts/reflex";
import { Gamemode } from "shared/store/game_config";

interface ClientToServerEvents {
    start(): void
}
interface ClientToServerFunctions {}

interface ServerToClientEvents {
    dispatch(actions: BroadcastAction[]): void,
    gamemode(gamemode: Gamemode): void,
    cycle_camera(): void
}
interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();