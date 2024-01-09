import { BaseComponent, Component } from "@flamework/components";
import { local_predicate } from ".";
import { OnStart, OnTick } from "@flamework/core";
import Animations from "client/config/animations";
import { CharacterInstance } from "../character";

type TracksConfig = {
    [id: number]: {
        track: AnimationTrack,
        fade_time?: number
    }
}

@Component({
    tag: "Character",
    predicate: local_predicate
})
class Animator extends BaseComponent<{}, CharacterInstance> implements OnStart, OnTick {
    private track_configs: TracksConfig = {};

    onStart(): void {
        this.track_configs = this._load_track_configs();
    }

    onTick(): void {
        const state = this.instance.Humanoid.GetState();
        switch (state) {
            case Enum.HumanoidStateType.Seated: {
                this._play_animation(Animations.sit.id);
                break;
            }
            default: {
                this._stop_all_animations();
                break;
            }
        }
    }

    private _play_animation(id: number): void {
        const track_config = this.track_configs[id];
        
        const track = track_config.track;
        if (track.IsPlaying === true) {
            return;
        }

        track.Play(track_config.fade_time);
    }

    private _stop_all_animations(): void {
        for (const [_, track_config] of pairs(this.track_configs)) {
            const track = track_config.track;
            track.Stop(track_config.fade_time);
        }
    }

    private _load_track_configs(): TracksConfig {
        let track_configs: TracksConfig = {};

        for (const [_, config] of pairs(Animations)) {
            const track = this._load_track(config.id);
            track_configs[config.id] = {
                track,
                fade_time: config.fade_time
            };
        }

        return track_configs;
    }

    private _load_track(id: number): AnimationTrack {
        const anim = new Instance("Animation");
        anim.AnimationId = `rbxassetid://${id}`;

        const track = this.instance.Humanoid.Animator.LoadAnimation(anim);
        return track;
    }
}