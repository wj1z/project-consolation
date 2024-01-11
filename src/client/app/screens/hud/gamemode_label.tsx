import Roact, { useState } from "@rbxts/roact";
import { Instant, Linear, useEventListener, useMotor } from "@rbxts/pretty-react-hooks";
import Text from "client/components/ui/text";
import Palette from "client/config/palette";
import { Events } from "client/networking";
import { Gamemode } from "shared/store/game_config";
import { play_audio } from "shared/util/audio";

const GamemodeLabel = () => {
    const [gamemode, set_gamemode] = useState<Gamemode>();

    const [fade_motion, set_fade_motion] = useMotor(1);
    const fade_transparency = () => fade_motion.map(t => t);

    useEventListener(Events.gamemode_reveal, new_gamemode => {
        set_gamemode(new_gamemode);
        set_fade_motion(new Instant(0));
        play_audio("gamemode");

        Promise.delay(3).andThenCall(
            () => set_fade_motion(new Linear(1, {
                velocity: 0.75
            }))
        );
    });

    return (
        <Text
            size={new UDim2(0.25, 200, 0.15, 0)}
            z_index={10}
            text_color={Palette.text}
            text_scaled={true}
            font={Font.fromEnum(Enum.Font.Merriweather)}
            text={`Gamemode: <b>${gamemode ?? "N/A"}</b>`}
            text_transparency={fade_transparency()}
            text_size={56}
            rich_text={true}
            text_stroke_transparency={fade_transparency()}
        >
            <uigradient Color={
                new ColorSequence([
                    new ColorSequenceKeypoint(0, Palette.white),
                    new ColorSequenceKeypoint(1, Palette.hazel)
                ])}
                Rotation={90}
            />
        </Text>
    );
}

export default GamemodeLabel;