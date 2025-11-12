import React, { useMemo } from "@rbxts/react";
import { ExcludedProps } from "client/ui/types";
import { ButtonProps, Button } from "./button";
import { Frame } from "./frame";
import { useButtonState } from "client/ui/hooks/use-button-state";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { springs } from "shared/constants/ui/springs";
import { getSound } from "shared/utils/asset-utils";
import { playSound } from "shared/utils/sfx-utils";
import { brighten } from "shared/utils/color-utils";

const HOVER_SOUND = getSound("MouseHover");
const CLICK_SOUND = getSound("MouseClick");

export interface AnimatedButtonProps extends ButtonProps {
	ignoreHoverScale?: boolean;
	ignorePressScale?: boolean;
	ignoreSound?: boolean;
	ignoreColor?: boolean;
	innerPaddingScale?: Vector2;
}

export function AnimatedButton(props: AnimatedButtonProps) {
	const { hovered, pressed, buttonStateCallbacks } = useButtonState();
	const [alpha, alphaMotor] = useMotion(1);
	const [brightness, brightnessMotor] = useMotion(0);

	const frameSize = useMemo(
		() =>
			props.innerPaddingScale
				? UDim2.fromScale(1 / props.innerPaddingScale.X, 1 / props.innerPaddingScale.Y)
				: UDim2.fromScale(1, 1),
		[],
	);

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

	const event = useMemo(
		() => ({
			onMouseDown: () => {
				props.onMouseDown?.();
				buttonStateCallbacks.onMouseDown();
			},

			onMouseUp: () => {
				props.onMouseUp?.();
				buttonStateCallbacks.onMouseUp();
			},

			onMouseEnter: () => {
				props.onMouseEnter?.();
				buttonStateCallbacks.onMouseEnter();
			},

			onMouseLeave: () => {
				props.onMouseLeave?.();
				buttonStateCallbacks.onMouseLeave();
			},
		}),
		[],
	);

	const buttonProps: ExcludedProps<ButtonProps, AnimatedButtonProps> = {
		...props,
		ignoreHoverScale: undefined,
		ignorePressScale: undefined,
		ignoreSound: undefined,
		ignoreColor: undefined,
		innerPaddingScale: undefined,
	};

	return (
		<Button {...buttonProps} {...event} BackgroundTransparency={1} cornerRadius={undefined} useStroke={false}>
			<Frame
				BackgroundColor3={brightness.map((value) => {
					return brighten(props.BackgroundColor3 as Color3, props.ignoreColor ? 0 : value);
				})}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={lerpBinding(alpha, UDim2.fromScale(0, 0), frameSize)}
				useStroke={props.useStroke}
				strokeSize={props.strokeSize}
				strokeColor={props.strokeColor}
				cornerRadius={props.cornerRadius}
			>
				{props.children}
			</Frame>
		</Button>
	);
}
