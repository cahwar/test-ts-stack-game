import React from "@rbxts/react";
import { InstanceProps, selectInstanceProps } from "client/react/interfaces/instance-props";
import { Property } from "client/react/types";
import { Corner } from "../style/corner";
import { Stroke } from "../style/stroke";

export interface FrameProps extends InstanceProps<Frame> {
	CornerRadius?: Property<UDim>;
	StrokeSize?: Property<number>;
	StrokeColor?: Property<Color3>;
}

export function Frame(props: FrameProps) {
	return (
		<frame BackgroundColor3={Color3.fromRGB(255, 255, 255)} {...selectInstanceProps(props)} BorderSizePixel={0}>
			{props.CornerRadius && <Corner Radius={props.CornerRadius} />}
			{(props.StrokeSize !== undefined || props.StrokeColor !== undefined) && (
				<Stroke Size={props.StrokeSize} Color={props.StrokeColor} />
			)}
			{props.children}
		</frame>
	);
}
