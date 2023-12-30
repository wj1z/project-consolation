const GAME_NAME: string = "Consopoop"

const TypewriterConfig = {
    WaitingForPlayers:
        (current: number, needed: number) =>
        `Waiting for players ${current}/${needed}.`,
    
    Intermission:
        (time: number) =>
        `Intermission ${time}s.`,
    Welcome: `Welcome to ${GAME_NAME}.`,
    Prelude: [
        "Quote1.",
        "Quote2.",
        "Quote3.",
    ],

    PlayerLeft: "All players left before finishing the game.",

    Cleanup: "Cleaning up the area."
};

export const select_random = (list: string[]) => list[
    new Random().NextInteger(0, list.size() - 1)
];

export default TypewriterConfig;