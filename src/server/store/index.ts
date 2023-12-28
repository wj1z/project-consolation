import { InferState, combineProducers } from "@rbxts/reflex";
import { shared_slices } from "shared/store";
import { broadcaster_middleware } from "./middleware/broadcaster";

export type RootStore = typeof store;
export type RootState = InferState<RootStore>;

function create_store() {
    const store = combineProducers({
        ...shared_slices
    });

    store.applyMiddleware(broadcaster_middleware());

    return store;
}

export const store = create_store();