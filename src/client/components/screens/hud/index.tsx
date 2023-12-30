import Roact from "@rbxts/roact";
import Layer from "client/components/ui/layer";
import Typewriter from "./typewriter";

function HUD() {
    return (
        <Layer display_order={0}>
            <Typewriter />
        </Layer>
    );
}

export default HUD;