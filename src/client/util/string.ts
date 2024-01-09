export function remove_rich_tags(text: string) {
    text = text.gsub("<br%s*/>", "\n")[0];
	return text.gsub("<[^<>]->", "")[0];
}