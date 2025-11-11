import React from "@rbxts/react";
import { NativeProps, useNativeProps } from "client/ui/hooks/use-native-props";
import { Property } from "client/ui/types";
import { Corner } from "../style/corner";
import { Stroke } from "../style/stroke";

export interface ButtonProps extends NativeProps<ImageButton> {
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	onMouseDown?: () => void;
	onMouseUp?: () => void;
	onMouseClick?: () => void;

	cornerRadius?: Property<UDim>;
	strokeSize?: Property<number>;
	strokeColor?: Property<Color3>;
	useStroke?: boolean;
}

export function Button(props: ButtonProps) {
	const nativeProps = useNativeProps(props);

	return (
		<imagebutton
			{...nativeProps}
			Event={{
				MouseButton1Click: () => {
					props.onMouseClick?.();
				},

				MouseEnter: () => {
					props.onMouseEnter?.();
				},

				MouseLeave: () => {
					props.onMouseLeave?.();
				},

				MouseButton1Down: () => {
					props.onMouseDown?.();
				},

				MouseButton1Up: () => {
					props.onMouseUp?.();
				},
			}}
		>
			{props.cornerRadius && <Corner radius={props.cornerRadius} />}
			{props.useStroke && <Stroke size={props.strokeSize} color={props.strokeColor} />}

			{props.children}
		</imagebutton>
	);
}
