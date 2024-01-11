import { Debris, ReplicatedStorage, RunService, SoundService } from "@rbxts/services";

const audio_folder = ReplicatedStorage.WaitForChild("audio");
const audios = audio_folder.GetDescendants().filter(audio => audio.IsA("Sound"));

const debug_name =
    RunService.IsServer() && "server" || "client"

export const play_audio = (audio_name: string, props?: Partial<WritableInstanceProperties<Sound>>, parent: Instance = SoundService) => {
    const audio: Sound | undefined = audios.find(audio => audio.Name === audio_name) as Sound;
    if (audio === undefined) {
        return warn(`Audio with name ${audio_name} not found.`);
    }

    const new_audio = audio.Clone();
    new_audio.Name = `${debug_name}_${audio.Name}`;
    new_audio.Parent = parent;

    if (props !== undefined) {
        for (const [prop_name, prop] of pairs(props)) {
            new_audio[prop_name] = prop as never;
        }
    }

    new_audio.Play();
    Debris.AddItem(new_audio, new_audio.TimeLength / new_audio.PlaybackSpeed);
}

export const play_audio_randomly =
    (audio_name: string, intensity: number = 0.125, parent: Instance = SoundService) => play_audio(
        audio_name,
        { PlaybackSpeed: new Random().NextNumber(1-intensity, 1+intensity) },
        parent
    );