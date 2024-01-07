import { Instant, Linear, useLifetime, useMotor } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect, useMemo } from "@rbxts/roact";
import Frame from "client/components/ui/frame";
import Text from "client/components/ui/text";
import Palette from "client/config/palette";
import PlayAudio from "shared/util/audio";
import { select_typewriter_is_animated, select_typewriter_text } from "shared/store/game_config/game_config_selectors";

const Typewriter = () => {
    const text = useSelector(select_typewriter_text);
    const is_animated = useMemo(
        () => useSelector(select_typewriter_is_animated)
    , [text]);

    const [writer_motion, set_writer_motion] = useMotor(0);

    const [fade_motion, set_fade_motion] = useMotor(0);
    const fade_transparency = () => fade_motion.map(t => t);

    const lifetime = useLifetime([text]);

    const typewrite = () => {
        const WRITER_SPEED = text.size() * 0.04

        set_writer_motion(new Instant(0));
        Promise.delay(0).andThenCall(
            () => set_writer_motion(
                new Linear(1, {
                    velocity: 1 / WRITER_SPEED
                }
            )
        ));
    };

    const delay_fade_out = () => {
        Promise.delay(4).andThenCall(() => {
            if (lifetime.getValue() < 4-0.25) return;
                
            set_fade_motion(
                new Linear(1, {
                    velocity: 0.45
                })
            )
        });
    };

    useEffect(() => {
        set_fade_motion(new Linear(0, { velocity: 2 }));
        delay_fade_out();

        if (is_animated === true) {
            typewrite();
        }
    }, [text]);

    return (
        <Frame
            anchor_point={new Vector2(0.5, 0)}
            position={new UDim2(0.5, 0, 0, 8)}
            size={new UDim2(0.15, 64, 0.1, 24)}
            background_color={Palette.base}
            background_transparency={fade_transparency()}
            corner_radius={new UDim(0.05)}
        >
            <uistroke Color={Palette.crust} Transparency={fade_transparency()} />
            <Text
                anchor_point={new Vector2(0.5, 0.5)}
                position={UDim2.fromScale(0.5, 0.5)}
                size={UDim2.fromScale(0.85, 0.85)}
                text={
                    is_animated
                    && writer_motion.map(t => 
                        string.sub(
                            text, 1, math.floor(t * text.size())
                        )
                    )
                    || text
                }
                text_color={Palette.text}
                text_scaled={true}
                text_size={16}
                text_transparency={fade_transparency()}

                change={{
                    Text: () => is_animated && PlayAudio("type")
                }}
            />
        </Frame>
    );
}

export default Typewriter;