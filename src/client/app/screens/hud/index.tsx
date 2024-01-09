import Roact from "@rbxts/roact";
import Layer from "client/components/ui/layer";
import Typewriter from "./typewriter";
import GamemodeLabel from "./gamemode_label";

function HUD() {
    return (
        <Layer display_order={1}>
            <Typewriter />
            <GamemodeLabel />
        </Layer>
    );
}

export default HUD;