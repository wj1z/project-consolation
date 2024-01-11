export function remove_rich_tags(text: string): string {
    text = text.gsub("<br%s*/>", "\n")[0];
	return text.gsub("<[^<>]->", "")[0];
}

export function to_time_format(time: number): string {
    return string.format("%i:%02i", time/60, time%60);
}