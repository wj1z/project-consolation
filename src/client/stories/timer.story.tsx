import Roact from "@rbxts/roact";
import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Timer from "client/app/screens/hud/timer";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/store";

export = hoarcekat(() => {
    return (
        <ReflexProvider producer={store}>
            <Timer />
        </ReflexProvider>
    );
});