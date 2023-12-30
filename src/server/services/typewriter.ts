import { Service } from "@flamework/core";
import { store } from "server/store";

@Service({
    loadOrder: 100
})
export class TypewriterService {
    write(text: string, is_animated?: boolean): void {
        store.set_typewriter_is_animated(is_animated ?? false);
        store.set_typewriter_text(text);
    }
}