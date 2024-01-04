import { BaseComponent, Component } from "@flamework/components";

interface CharacterInstance extends Model {
    Humanoid: Humanoid & {
        Animator: Animator
    }
}

@Component({
    tag: "Character"
})
export class Character extends BaseComponent<{}, CharacterInstance> {

}