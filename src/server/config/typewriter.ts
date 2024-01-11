import { Gamemode } from "shared/store/game_config";

const TypewriterConfig = {
    waiting_for_players:
        (current: number, needed: number) =>
        `Waiting for players: <b>${current} / ${needed}</b>.`,
    
    intermission:
        (time: number) =>
        `Intermission: <b>${time}s</b>.`,
    prelude: [
        `“Risk is the shotgun, and choice is pulling the trigger.”`,
        `“Eight strangers, one goal.”`,
        `“In the end, our prayers will become our last words.”`
    ],
    gamemode: {
        [Gamemode.Classic]: "<b>Classic</b>: You either pull the trigger or drop the bullet."
    },

    start: {
        [Gamemode.Classic]: (real: number, fake: number) =>
        `There ${real > 1 ? "are" : "is"} <b>${real} real ${real > 1 ? "bullets" : "bullet"}</b> and <b>${fake} fake ${fake > 1 ? "bullets" : "bullet"}</b>.`
    },

    winner: (winner_name: string) => `The winner is <b>${winner_name}</b>.`,
    no_players_left: "All players left before finishing the game.",
    timeout: "Time is out.",

    cleanup: "Cleaning up the area..."
};

export const select_random = (list: string[]) => list[
    new Random().NextInteger(0, list.size() - 1)
];

export default TypewriterConfig;