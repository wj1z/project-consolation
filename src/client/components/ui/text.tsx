import Roact from "@rbxts/roact";
import { FrameProps } from "./frame";

export interface TextProps<T extends Instance = TextLabel> extends FrameProps<T> {
    font?: Font,
	text?: string | Roact.Binding<string>,
	text_color?: Color3 | Roact.Binding<Color3>,
	text_size?: number | Roact.Binding<number>,
	text_transparency?: number | Roact.Binding<number>,
    text_stroke_color?: Color3 | Roact.Binding<Color3>,
    text_stroke_transparency?: number | Roact.Binding<number>,
	text_wrapped?: boolean | Roact.Binding<boolean>,
	text_x_alignment?: Roact.InferEnumNames<Enum.TextXAlignment>,
	text_y_alignment?: Roact.InferEnumNames<Enum.TextYAlignment>,
	text_truncate?: Roact.InferEnumNames<Enum.TextTruncate>,
	text_scaled?: boolean | Roact.Binding<boolean>,
	text_height?: number | Roact.Binding<number>,
	text_auto_resize?:
        | Enum.AutomaticSize.X
        | Enum.AutomaticSize.Y
        | Enum.AutomaticSize.XY,
	rich_text?: boolean | Roact.Binding<boolean>,
	max_visible_graphemes?: number | Roact.Binding<number>
}

const Text = (props: TextProps) => {
    return (
        <textlabel
            Font={Enum.Font.Unknown}
            FontFace={props.font ?? Font.fromEnum(Enum.Font.SourceSans)}
            Text={props.text}
            TextColor3={props.text_color}
            TextSize={props.text_size ?? 18}
            TextTransparency={props.text_transparency}
            TextStrokeColor3={props.text_stroke_color}
            TextStrokeTransparency={props.text_stroke_transparency}
            TextWrapped={props.text_wrapped}
            TextXAlignment={props.text_x_alignment}
            TextYAlignment={props.text_y_alignment}
            TextTruncate={props.text_truncate}
            TextScaled={props.text_scaled}
            LineHeight={props.text_height}
            RichText={props.rich_text}
            MaxVisibleGraphemes={props.max_visible_graphemes}
            AutomaticSize={props.text_auto_resize}
            AnchorPoint={props.anchor_point ?? new Vector2(0.5, 0.5)}
            Position={props.position ?? UDim2.fromScale(0.5, 0.5)}
            Size={props.size}
            SizeConstraint={props.size_constraint}
            BackgroundColor3={props.background_color}
            BackgroundTransparency={props.background_transparency ?? 1}
            ClipsDescendants={props.clips_descendants}
            Visible={props.visible}
            ZIndex={props.z_index}
            LayoutOrder={props.layout_order}
            Change={props.change ?? {}}
            Event={props.event ?? {}}
        >
            {props.text_scaled && <uitextsizeconstraint MinTextSize={1} MaxTextSize={props.text_size} />}
            {props.corner_radius && <uicorner CornerRadius={props.corner_radius} />}
            {props.children}
        </textlabel>
    );
};

export default Text;