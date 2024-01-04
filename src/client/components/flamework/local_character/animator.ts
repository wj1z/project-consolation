import { Component } from "@flamework/components";
import { LocalCharacter, local_predicate } from ".";

@Component({
    tag: "Character",
    predicate: local_predicate
})
class Animator extends LocalCharacter {
    
}