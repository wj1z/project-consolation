import Roact from "@rbxts/roact";
import { ReflexProvider } from "@rbxts/react-reflex";
import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Typewriter from "client/components/screens/hud/typewriter";
import { store } from "client/store";

export = hoarcekat(() => {
    return (
        <ReflexProvider producer={store}>
            <Typewriter />
        </ReflexProvider>
    )
});