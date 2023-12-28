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
        this.sit_on_chair();
    }

    sit_on_chair(): void {
        const hum = this.instance.Humanoid;
        if (
            hum.GetState() === Enum.HumanoidStateType.None ||
            hum.GetState() === Enum.HumanoidStateType.Seated ||
            
            store.getState(select_game_state) !== GameState.Intermission
        ) {
            return;
        }

        for (const chair of chairs) {
            const seat: Seat = chair.FindFirstChildOfClass("Seat") as Seat;
            if (seat.Occupant !== undefined) {
                if (seat.Occupant !== hum) {
                    continue;
                }
                seat.FindFirstChild("SeatWeld")?.Destroy();
            }

            seat.Sit(hum);
            break;
        }
    }
}