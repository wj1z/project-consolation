import { InferState, combineProducers } from "@rbxts/reflex";
import { shared_slices } from "shared/store";
import { receiver_middleware } from "./middleware/receiver";

export type RootStore = typeof store;
export type RootState = InferState<RootStore>;

function create_store() {
    const store = combineProducers({
        ...shared_slices
    });

    store.applyMiddleware(receiver_middleware());

    return store;
}

export const store = create_store();