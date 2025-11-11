import React, { useMemo } from "@rbxts/react";
import { ExcludedProps } from "client/ui/types";
import { ButtonProps, Button } from "./button";
import { Frame } from "./frame";
import { useButtonState } from "client/ui/hooks/use-button-state";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { springs } from "shared/constants/ui/springs";
import { getSound } from "shared/utils/asset-utils";
import { playSound } from "shared/utils/sfx-utils";

const HOVER_SOUND = getSound("MouseHover");
const CLICK_SOUND = getSound("MouseClick");

export interface AnimatedButtonProps extends ButtonProps {
	ignoreScale?: boolean;
	ignoreSound?: boolean;
}

export function AnimatedButton(props: AnimatedButtonProps) {
	const { hovered, pressed, buttonStateCallbacks } = useButtonState();
	const [alpha, alphaMotor] = useMotion(1);

	useUpdateEffect(() => {
		const scale = pressed || hovered ? (pressed ? 0.9 : 1.1) : 1;
		alphaMotor.spring(scale, springs.responsive);
	}, [hovered, pressed]);

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
		ignoreScale: undefined,
		ignoreSound: undefined,
	};

	return (
		<Button {...buttonProps} {...event} BackgroundTransparency={1} cornerRadius={undefined} useStroke={false}>
			<Frame
				BackgroundColor3={props.BackgroundColor3}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={lerpBinding(props.ignoreScale ? 1 : alpha, UDim2.fromScale(0, 0), UDim2.fromScale(1, 1))}
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
