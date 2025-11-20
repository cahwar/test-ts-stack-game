import React, { useMemo } from "@rbxts/react";
import { ButtonProps } from "./button";
import { Frame } from "./frame";
import { useButtonState } from "client/ui/hooks/use-button-state";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { springs } from "shared/constants/ui/springs";
import { getSound } from "shared/utils/asset-utils";
import { playSound } from "shared/utils/sfx-utils";
import { brighten } from "shared/utils/color-utils";
import { useNativeProps } from "client/ui/hooks/use-native-props";
import { ButtonContext } from "client/ui/contexts/button-context";
import { useBindedProperty } from "client/ui/hooks/use-binded-property";

const HOVER_SOUND = getSound("MouseHover");
const CLICK_SOUND = getSound("MouseClick");

export interface AnimatedButtonProps extends ButtonProps {
	innerPaddingScale?: Vector2;
	ignoreHoverScale?: boolean;
	ignorePressScale?: boolean;
	ignoreSound?: boolean;
	ignoreColor?: boolean;
}

export function AnimatedButton(props: AnimatedButtonProps) {
	const { hovered, pressed, buttonStateCallbacks } = useButtonState();
	const [brightness, brightnessMotor] = useMotion(0);
	const [alpha, alphaMotor] = useMotion(1);

	useUpdateEffect(() => {
		let scale = 1;

		if (hovered && !props.ignoreHoverScale) scale = 1.1;
		if (pressed && !props.ignorePressScale) scale = 0.9;

		alphaMotor.spring(scale, springs.responsive);
	}, [hovered, pressed]);

	useUpdateEffect(() => {
		brightnessMotor.spring(hovered ? 1 : 0, springs.stiff);
	}, [hovered]);

	useUpdateEffect(() => {
		if (hovered) {
			playSound(HOVER_SOUND);
		}
	}, [hovered]);

	useUpdateEffect(() => {
		if (pressed) {
			playSound(CLICK_SOUND);
		}
	}, [pressed]);

	const frameSize = useMemo(
		() =>
			props.innerPaddingScale
				? UDim2.fromScale(1 / props.innerPaddingScale.X, 1 / props.innerPaddingScale.Y)
				: UDim2.fromScale(1, 1),
		[],
	);

	const event = useMemo(
		() => ({
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
		}),
		[],
	);

	const nativeProps = useNativeProps(props);

	return (
		<imagebutton {...nativeProps} Event={event} BackgroundTransparency={1}>
			<Frame
				BackgroundColor3={brightness.map((value) => {
					return brighten(
						useBindedProperty(props.BackgroundColor3) ?? Color3.fromRGB(255, 255, 255),
						props.ignoreColor ? 0 : value,
					);
				})}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={lerpBinding(alpha, UDim2.fromScale(0, 0), frameSize)}
				useStroke={props.useStroke}
				strokeSize={props.strokeSize}
				strokeColor={props.strokeColor}
				cornerRadius={props.cornerRadius}
			>
				<ButtonContext.Provider value={{ hovered, pressed }}>{props.children}</ButtonContext.Provider>
			</Frame>
		</imagebutton>
	);
}
