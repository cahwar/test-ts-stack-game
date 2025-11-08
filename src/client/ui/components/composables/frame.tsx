import React from "@rbxts/react";
import { GuiObjectProps, selectGuiObjectProps } from "client/ui/interfaces/gui-object-props";
import { Property } from "client/ui/types";
import { Corner } from "../style/corner";
import { Stroke } from "../style/stroke";

export interface FrameProps extends GuiObjectProps<Frame> {
	CornerRadius?: Property<UDim>;
	StrokeSize?: Property<number>;
	StrokeColor?: Property<Color3>;
}

export function Frame(props: FrameProps) {
	return (
		<frame BackgroundColor3={Color3.fromRGB(255, 255, 255)} {...selectGuiObjectProps(props)} BorderSizePixel={0}>
			{props.CornerRadius && <Corner Radius={props.CornerRadius} />}
			{(props.StrokeSize !== undefined || props.StrokeColor !== undefined) && (
				<Stroke Size={props.StrokeSize} Color={props.StrokeColor} />
			)}
			{props.children}
		</frame>
	);
}
