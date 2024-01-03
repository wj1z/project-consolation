const GAME_NAME: string = "Consopoop"

const TypewriterConfig = {
    waiting_for_players:
        (current: number, needed: number) =>
        `Waiting for players ${current}/${needed}.`,
    
    intermission:
        (time: number) =>
        `Intermission ${time}s.`,
    welcome: `Welcome to ${GAME_NAME}.`,
    prelude: [
        "Quote1.",
        "Quote2.",
        "Quote3.",
    ],

    players_left: "All players left before finishing the game.",

    cleanup: "Cleaning up the area."
};

export const select_random = (list: string[]) => list[
    new Random().NextInteger(0, list.size() - 1)
];

export default TypewriterConfig;