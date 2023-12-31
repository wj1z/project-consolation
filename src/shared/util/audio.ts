import { Debris, ReplicatedStorage, RunService, SoundService } from "@rbxts/services";

const audio_list =
    ReplicatedStorage.WaitForChild("audio").GetDescendants().filter(
        (instance: Instance) => instance.IsA("Sound")
    );

const debug_name =
    RunService.IsServer() && "server" || "client"

export const play_audio = (audio_name: string, parent?: Instance, props?: Partial<WritableInstanceProperties<Sound>>) => {
    const audio: Sound | undefined =
        audio_list.find(instance => instance.Name === audio_name) as Sound | undefined;
    if (audio === undefined) {
        return warn(`Audio with name ${audio_name} not found.`);
    }

    const new_audio = audio.Clone();
    new_audio.Name = `${debug_name}_${audio.Name}`;
    new_audio.Parent = parent ?? SoundService;

    if (props !== undefined) {
        for (const [prop_name, prop] of pairs(props)) {
            new_audio[prop_name] = prop as never;
        }
    }

    new_audio.Play();
    Debris.AddItem(new_audio, new_audio.TimeLength / new_audio.PlaybackSpeed);
}