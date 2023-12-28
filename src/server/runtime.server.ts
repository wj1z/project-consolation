import { Flamework } from "@flamework/core";
import { store } from "./store";

store.set_typewriter_text("Welcome to mustyload");

Flamework.addPaths("src/server/services");
Flamework.addPaths("src/server/components/flamework");
Flamework.addPaths("src/shared/components/flamework");

Flamework.ignite();