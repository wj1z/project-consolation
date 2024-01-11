import Roact, { forwardRef } from "@rbxts/roact";

interface CanvasProps extends Roact.PropsWithChildren {
    ref?: Roact.Ref<Frame>,
    event?: Roact.JsxInstanceEvents<Frame>,
	change?: Roact.JsxInstanceChangeEvents<Frame>,
	size?: UDim2 | Roact.Binding<UDim2>,
	position?: UDim2 | Roact.Binding<UDim2>,
	anchor_point?: Vector2 | Roact.Binding<Vector2>,
	clips_descendants?: boolean | Roact.Binding<boolean>,
	layout_order?: number | Roact.Binding<number>,
	visible?: boolean | Roact.Binding<boolean>,
	z_index?: number | Roact.Binding<number>
}

const Canvas = forwardRef((props: CanvasProps, ref: Roact.Ref<Frame>) => {
    return (
        <frame
            ref={ref}
            Size={props.size ?? UDim2.fromScale(1, 1)}
			Position={props.position ?? UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={props.anchor_point ?? new Vector2(0.5, 0.5)}
			ClipsDescendants={props.clips_descendants}
			LayoutOrder={props.layout_order}
			Visible={props.visible}
			ZIndex={props.z_index}
			BackgroundTransparency={1}
			Event={props.event ?? {}}
			Change={props.change ?? {}}
        >
            {props.children}
        </frame>
    )
});

export default Canvas;