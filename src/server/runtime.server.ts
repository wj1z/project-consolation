import { Flamework } from "@flamework/core";
import { store } from "./store";

store.set_shared_number(0);
store.set_shared_string("Server!");

Flamework.addPaths("src/server/services");
Flamework.addPaths("src/server/components/flamework");
Flamework.addPaths("src/shared/components/flamework");

Flamework.ignite();