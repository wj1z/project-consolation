import { Linear, Spring, useMotor } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import Canvas from "client/components/ui/canvas";
import Image from "client/components/ui/image";
import Text from "client/components/ui/text";
import Palette from "client/config/palette";
import { to_time_format } from "client/util/string";
import { GameState } from "shared/store/game_config";
import { select_game_state, select_time_left } from "shared/store/game_config/game_config_selectors";
import { play_audio } from "shared/util/audio";

const Timer = () => {
    const time = useSelector(select_time_left);

    const game_state = useSelector(select_game_state);

    const is_visible = () => game_state === GameState.Running;
    const [fade_motion, set_fade_motion] = useMotor(is_visible() ? 0 : 1);
    const fade_transparency = (threshold: number = 0) => fade_motion.map(t => math.clamp(t + threshold, 0, 1));

    const is_enough_time = () => (time > 30);
    const [color_motion, set_color_motion] = useMotor(is_enough_time() ? 0 : 1);
    const [shake_motion, set_shake_motion, shake_api] = useMotor({x: 0, y: 0});
    const color = () => color_motion.map(c => Palette.white.Lerp(Palette.red, c));
    const shake = (origin: UDim2) => shake_motion.map( s => origin.add(UDim2.fromOffset(s.x, s.y)) );

    useEffect(() => {
        set_fade_motion(
            new Linear(game_state === GameState.Running ? 0 : 1, {
                velocity: 1.75
            })
        );
    }, [game_state]);

    useEffect(() => {
        set_color_motion(
            new Linear(is_enough_time() ? 0 : 1, {
                velocity: 5
            })
        );
        if (!is_enough_time()) {
            const random_sign = () => new Random().NextInteger(0, 1) === 1 ? -1 : 1;
            set_shake_motion({
                x: new Spring(0, { dampingRatio: 0.05 }),
                y: new Spring(0, { dampingRatio: 0.1 })
            });
            shake_api.impulse({
                x: 75 * random_sign(),
                y: 50 * random_sign()
            });
            play_audio("timer");
        }
    }, [time]);

    return (
        <Canvas
            anchor_point={new Vector2(0.5, 0)}
            position={new UDim2(0.5, 0, 0.115, 32)}
            size={new UDim2(0.075, 0, 0.05, 2)}
        >
            <Image
                image="rbxassetid://5158061669"
                image_transparency={fade_transparency()}
                anchor_point={new Vector2(0, 0.5)}
                position={shake(UDim2.fromScale(0, 0.5))}
                size_constraint="RelativeXX"
                size={UDim2.fromScale(0.375, 0.375)}
            />
            <Text
                anchor_point={new Vector2(1, 0.5)}
                position={new UDim2(1, 0, 0.5, 0)}
                size={UDim2.fromScale(0.5, 0.9)}
                font={Font.fromEnum(Enum.Font.RobotoMono)}
                text={to_time_format(time)}
                text_size={28}
                text_color={color()}
                text_scaled={true}
                text_x_alignment="Right"
                text_transparency={fade_transparency()}
            >
                <uistroke Transparency={fade_transparency(0.25)} />
            </Text>
        </Canvas>
    );
}

export default Timer;