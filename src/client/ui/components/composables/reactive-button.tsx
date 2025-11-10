import { lerpBinding, useEventListener, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";

import { GuiObjectProps } from "client/ui/interfaces/gui-object-props";
import { Property } from "client/ui/types";
import { springs } from "shared/constants/ui/springs";
import { Frame } from "./frame";
import { getSound } from "shared/utils/asset-utils";
import { playSound } from "shared/utils/sfx-utils";
import { useButtonState } from "client/ui/hooks/use-button-state";

const HOVER_SCALE = 1.1;
const PRESS_SCALE = 0.9;

const HOVER_SOUND = getSound("MouseHover");
const CLICK_SOUND = getSound("MouseClick");

export interface ReactiveButtonProps extends GuiObjectProps<ImageButton> {
	OnClick?: () => void;
	OnMouseDown?: () => void;
	OnMouseUp?: () => void;
	OnMouseEnter?: () => void;
	OnMouseLeave?: () => void;
	CornerRadius?: Property<UDim>;
	StrokeSize?: Property<number>;
	StrokeColor?: Property<Color3>;
}

export function ReactiveButton(props: ReactiveButtonProps) {
	const [hovered, pressed, buttonStateEvents] = useButtonState();

	const [scale, scaleMotor] = useMotion(1);

	useUpdateEffect(() => {
		if (pressed) scaleMotor.spring(PRESS_SCALE, springs.responsive);
		else if (hovered) scaleMotor.spring(HOVER_SCALE, springs.responsive);
		else scaleMotor.spring(1, springs.responsive);
	}, [hovered, pressed]);

	const guiObjectProps = {
		...props,
		OnClick: undefined,
		OnMouseDown: undefined,
		OnMouseUp: undefined,
		OnMouseEnter: undefined,
		OnMouseLeave: undefined,
		CornerRadius: undefined,
		StrokeSize: undefined,
		StrokeColor: undefined,
	};

	return (
		<imagebutton
			{...guiObjectProps}
			BackgroundTransparency={1}
			Event={{
				MouseButton1Click: () => {
					playSound(CLICK_SOUND);
					props.OnClick?.();
				},

				MouseButton1Down: () => {
					props.OnMouseDown?.();
				},

				MouseButton1Up: () => {
					props.OnMouseUp?.();
				},

				MouseEnter: () => {
					playSound(HOVER_SOUND);
					props.OnMouseEnter?.();
				},

				MouseLeave: () => {
					props.OnMouseLeave?.();
				},
			}}
		>
			<Frame
				BackgroundTransparency={props.BackgroundTransparency}
				BackgroundColor3={props.BackgroundColor3}
				CornerRadius={props.CornerRadius}
				StrokeColor={props.StrokeColor}
				StrokeSize={props.StrokeSize}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={lerpBinding(scale, UDim2.fromScale(0, 0), props.Size as UDim2)}
			>
				{props.children}
			</Frame>
		</imagebutton>
	);
}
