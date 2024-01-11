import Roact from "@rbxts/roact";
import Layer from "client/components/ui/layer";
import Typewriter from "./typewriter";
import GamemodeLabel from "./gamemode_label";
import Timer from "./timer";

function HUD() {
    return (
        <Layer display_order={1}>
            <Typewriter />
            <GamemodeLabel />
            <Timer />
        </Layer>
    );
}

export default HUD;