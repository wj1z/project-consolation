import Roact from "@rbxts/roact";
import { FrameProps } from "./frame";

export interface ImageProps extends FrameProps<ImageLabel> {
    image: string,
	image_color?: Color3 | Roact.Binding<Color3>,
	image_transparency?: number | Roact.Binding<number>,
	image_rect_offset?: Vector2 | Roact.Binding<Vector2>,
	image_rect_size?: Vector2 | Roact.Binding<Vector2>,
	scale_type?: Roact.InferEnumNames<Enum.ScaleType>,
	slice_scale?: number | Roact.Binding<number>,
	slice_center?: Rect | Roact.Binding<Rect>,
	tile_size?: UDim2 | Roact.Binding<UDim2>
}

const Image = (props: ImageProps) => {
    return (
        <imagelabel
            Image={props.image}
            ImageColor3={props.image_color}
            ImageTransparency={props.image_transparency}
            ImageRectOffset={props.image_rect_offset}
            ImageRectSize={props.image_rect_size}
            ScaleType={props.scale_type}
            SliceScale={props.slice_scale}
            SliceCenter={props.slice_center}
            TileSize={props.tile_size}
            AnchorPoint={props.anchor_point ?? new Vector2(0.5, 0.5)}
            Position={props.position ?? UDim2.fromScale(0.5, 0.5)}
            Size={props.size}
            SizeConstraint={props.size_constraint}
            Rotation={props.rotation}
            BackgroundColor3={props.background_color}
            BackgroundTransparency={props.background_transparency ?? 1}
            ClipsDescendants={props.clips_descendants}
            Visible={props.visible}
            ZIndex={props.z_index}
            LayoutOrder={props.layout_order}
            BorderSizePixel={0}
            Event={props.event ?? {}}
            Change={props.change ?? {}}
        >
            {props.corner_radius && <uicorner CornerRadius={props.corner_radius} />}
            {props.children}
        </imagelabel>
    );
}

export default Image;