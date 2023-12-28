import { InferState, combineProducers } from "@rbxts/reflex";
import { client_slice } from "./client_slice";
import { shared_slices } from "shared/store";
import { receiver_middleware } from "./middleware/receiver";

export type RootStore = typeof store;
export type RootState = InferState<RootStore>;

function create_store() {
    const store = combineProducers({
        ...shared_slices,
        client: client_slice
    });

    store.applyMiddleware(receiver_middleware());

    return store;
}

export const store = create_store();