import { Networking } from "@flamework/networking";
import { BroadcastAction } from "@rbxts/reflex";
import { CameraShakePreset } from "shared/config/camera_shakes";
import { Gamemode } from "shared/store/game_config";

interface ClientToServerEvents {
    start(): void,
    look_at(camera_dir: Vector3): void
}
interface ClientToServerFunctions {}

interface ServerToClientEvents {
    dispatch(actions: BroadcastAction[]): void,

    gamemode_reveal(gamemode: Gamemode): void,

    shake_camera(camera_shake_preset: CameraShakePreset): void,
    cycle_camera(): void,
    
    looked_at(character: Model, camera_dir: Vector3): void
}
interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();