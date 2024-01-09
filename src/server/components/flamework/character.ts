import { BaseComponent, Component } from "@flamework/components";
import { OnTick } from "@flamework/core";
import { CollectionService, Players } from "@rbxts/services";
import { store } from "server/store";
import { GameState } from "shared/store/game_config";
import { select_active_players, select_game_state } from "shared/store/game_config/game_config_selectors";

const chairs: Model[] = CollectionService.GetTagged("Chair") as Model[];

interface CharacterInstance extends Model {
    Humanoid: Humanoid
}

@Component({
    tag: "Character"
})
export class Character extends BaseComponent<{}, CharacterInstance> implements OnTick {
    onTick(): void {
        const game_state = store.getState(select_game_state);
        const active_players = store.getState(select_active_players);

        const player = Players.GetPlayerFromCharacter(this.instance);
        if (
            (game_state !== GameState.Running)
            || (player && active_players.includes(player))
        ) this.sit_on_chair();
    }

    sit_on_chair(): void {
        const hum = this.instance.Humanoid;
        if (
            hum.GetState() === Enum.HumanoidStateType.None
            || hum.GetState() === Enum.HumanoidStateType.Seated
        ) return;

        hum.SeatPart?.FindFirstChild("SeatWeld")?.Destroy();
        for (const chair of chairs) {
            const seat: Seat = chair.FindFirstChildOfClass("Seat") as Seat;
            if (seat.Occupant !== undefined) continue;

            seat.Sit(hum);
            break;
        }
    }
}