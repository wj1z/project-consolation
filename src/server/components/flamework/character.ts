import { BaseComponent, Component } from "@flamework/components";
import { OnTick } from "@flamework/core";
import { CollectionService } from "@rbxts/services";
import { store } from "server/store";
import { GameState } from "shared/store/game_config";
import { select_game_state } from "shared/store/game_config/game_config_selectors";

const chairs: Model[] = CollectionService.GetTagged("Chair") as Model[];

interface CharacterInstance extends Model {
    Humanoid: Humanoid
}

@Component({
    tag: "Character"
})
export class Character extends BaseComponent<{}, CharacterInstance> implements OnTick {
    onTick(): void {
        if (store.getState(select_game_state) !== GameState.Running) {
            this.sit_on_chair();
        }
    }

    sit_on_chair(): void {
        const hum = this.instance.Humanoid;
        if (
            hum.GetState() === Enum.HumanoidStateType.None
            || hum.GetState() === Enum.HumanoidStateType.Seated
        ) {
            return;
        }

        hum.SeatPart?.FindFirstChild("SeatWeld")?.Destroy();
        for (const chair of chairs) {
            const seat: Seat = chair.FindFirstChildOfClass("Seat") as Seat;
            if (seat.Occupant !== undefined) {
                continue;
            }

            seat.Sit(hum);
            break;
        }
    }
}