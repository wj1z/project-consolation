import { Instant, Linear, useLifetime, useMotor } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect, useMemo } from "@rbxts/roact";
import Frame from "client/components/ui/frame";
import Text from "client/components/ui/text";
import Palette from "client/config/palette";
import { select_typewriter_is_animated, select_typewriter_text } from "shared/store/game_config/game_config_selectors";
import { remove_rich_tags } from "client/util/string";
import { play_audio } from "shared/util/audio";

const Typewriter = () => {
    const text = useSelector(select_typewriter_text);
    const is_animated = useMemo(
        () => useSelector(select_typewriter_is_animated)
    , [text]);

    const [writer_motion, set_writer_motion, writer_api] = useMotor(0);
    const text_length = utf8.len(remove_rich_tags(text))[0] as number;
    const typewrite = () => {
        const WRITER_SPEED = text_length * 0.0325

        set_writer_motion(new Instant(0));
        writer_api.motor.step(0);
        set_writer_motion(new Linear(1, { velocity: 1 / WRITER_SPEED }));
    };

    const [fade_motion, set_fade_motion] = useMotor(0);
    const fade_transparency = (threshold: number = 0) => fade_motion.map(t => math.clamp(t + threshold, 0, 1));
    
    const lifetime = useLifetime([text]);
    const FADE_OUT_TIME = 5;
    const delay_fade_out = () => {
        Promise.delay(FADE_OUT_TIME).andThenCall(() => {
            if (lifetime.getValue() < FADE_OUT_TIME-0.25) return;
            set_fade_motion(
                new Linear(1, {
                    velocity: 0.45
                })
            )
        });
    };

    useEffect(() => {
        set_fade_motion(new Linear(0, { velocity: 2 }));
        if (is_animated === true) {
            typewrite();
            delay_fade_out();
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
            <uigradient Color={
                new ColorSequence([
                    new ColorSequenceKeypoint(0, Palette.white),
                    new ColorSequenceKeypoint(1, Palette.dark_hazel)
                ])}
                Rotation={90}
            />
            <Text
                size={UDim2.fromScale(0.85, 0.85)}
                text={text}
                text_color={Palette.text}
                text_scaled={true}
                text_size={16}
                text_transparency={fade_transparency()}
                rich_text={true}
                text_stroke_transparency={fade_transparency(0.5)}
                max_visible_graphemes={
                    is_animated
                    && writer_motion.map(t => t * text_length)
                    || text_length
                }
                change={{
                    MaxVisibleGraphemes: () => is_animated && play_audio("type")
                }}
            />
        </Frame>
    );
}

export default Typewriter;