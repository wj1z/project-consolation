import { Component } from "@flamework/components";
import { Character } from "../character";
import { Players } from "@rbxts/services";

export const local_predicate = (instance: Instance) => {
    const player = Players.LocalPlayer;
    if (player.Character === undefined) {
        player.CharacterAdded.Wait();
    }
    return Players.GetPlayerFromCharacter(instance) === player;
}

@Component({
    tag: "Character",
    predicate: local_predicate
})
export class LocalCharacter extends Character {
    
}