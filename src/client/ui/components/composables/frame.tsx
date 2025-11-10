import React from "@rbxts/react";
import { NativeProps, useNativeProps } from "client/ui/hooks/use-native-props";
import { Property } from "client/ui/types";
import { Corner } from "../style/corner";
import { Stroke } from "../style/stroke";

export interface FrameProps extends NativeProps<Frame> {
	cornerRadius?: Property<UDim>;
	strokeSize?: Property<number>;
	strokeColor?: Property<Color3>;
	useStroke?: boolean;
}

export function Frame(props: FrameProps) {
	const nativeProps = useNativeProps(props);

	return (
		<frame BackgroundColor3={Color3.fromRGB(255, 255, 255)} {...nativeProps} BorderSizePixel={0}>
			{props.cornerRadius && <Corner radius={props.cornerRadius} />}
			{props.useStroke && <Stroke size={props.strokeSize} color={props.strokeColor} />}
			{props.children}
		</frame>
	);
}
