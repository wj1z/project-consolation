import Roact, { useState } from "@rbxts/roact";
import { Instant, Linear, useEventListener, useMotor } from "@rbxts/pretty-react-hooks";
import Text from "client/components/ui/text";
import Palette from "client/config/palette";
import { Events } from "client/networking";
import { Gamemode } from "shared/store/game_config";
import PlayAudio from "shared/util/audio";

const GamemodeLabel = () => {
    const [gamemode, set_gamemode] = useState<Gamemode>();

    const [fade_motion, set_fade_motion] = useMotor(1);
    const fade_transparency = () => fade_motion.map(t => t);

    useEventListener(Events.gamemode, new_gamemode => {
        set_gamemode(new_gamemode);

        set_fade_motion(new Instant(0));
        Promise.delay(3).andThenCall(
            () => set_fade_motion(new Linear(1, {
                velocity: 0.75
            }))
        );

        PlayAudio("gamemode");
    });

    return (
        <Text
            anchor_point={new Vector2(0.5, 0.5)}
            position={UDim2.fromScale(0.5, 0.5)}
            size={new UDim2(0.25, 200, 0.15, 0)}
            z_index={10}
            text_color={Palette.text}
            text_scaled={true}
            font={Font.fromEnum(Enum.Font.Antique)}
            text={`Gamemode: ${gamemode ?? "N/A"}`}
            text_transparency={fade_transparency()}
            text_size={64}
        >
            <uistroke
                Color={Palette.crust}
                Thickness={2}
                Transparency={fade_transparency()}
            />
        </Text>
    );
}

export default GamemodeLabel;