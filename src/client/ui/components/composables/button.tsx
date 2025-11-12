import React from "@rbxts/react";
import { NativeProps, useNativeProps } from "client/ui/hooks/use-native-props";
import { BindedProperty } from "client/ui/types";
import { Corner } from "../style/corner";
import { Stroke } from "../style/stroke";
import { ButtonContext } from "client/ui/contexts/button-context";
import { useButtonState } from "client/ui/hooks/use-button-state";

export interface ButtonProps extends NativeProps<ImageButton> {
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	onMouseDown?: () => void;
	onMouseUp?: () => void;
	onMouseClick?: () => void;

	cornerRadius?: BindedProperty<UDim>;
	strokeSize?: BindedProperty<number>;
	strokeColor?: BindedProperty<Color3>;
	useStroke?: boolean;
}

export function Button(props: ButtonProps) {
	const { pressed, hovered, buttonStateCallbacks } = useButtonState();

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
					buttonStateCallbacks.onMouseEnter();
				},

				MouseLeave: () => {
					props.onMouseLeave?.();
					buttonStateCallbacks.onMouseLeave();
				},

				MouseButton1Down: () => {
					props.onMouseDown?.();
					buttonStateCallbacks.onMouseDown();
				},

				MouseButton1Up: () => {
					props.onMouseUp?.();
					buttonStateCallbacks.onMouseUp();
				},
			}}
		>
			{props.cornerRadius && <Corner radius={props.cornerRadius} />}
			{props.useStroke && <Stroke size={props.strokeSize} color={props.strokeColor} />}

			<ButtonContext.Provider value={{ hovered, pressed }}>{props.children}</ButtonContext.Provider>
		</imagebutton>
	);
}
