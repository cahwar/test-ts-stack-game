import React, { useEffect, useState } from "@rbxts/react";
import { FrameProps, Frame } from "./frame";
import { ExcludedProps } from "client/ui/types";
import { useBindingState, useMotion } from "@rbxts/pretty-react-hooks";
import { getPositiveOrNegative } from "shared/utils/functions/get-positive-or-negative";
import { springs } from "shared/constants/ui/springs";
import { useButtonContext } from "client/ui/contexts/button-context";
import { useBindedProperty } from "client/ui/hooks/use-property";

export interface HoverTiltProps extends FrameProps {
	useButtonContext?: boolean;
	angle?: number;
}

export function HoverTilt(props: HoverTiltProps) {
	const buttonHovered = props.useButtonContext ? useButtonContext().hovered : false;
	const originalAngle = props.Rotation !== undefined ? useBindedProperty(props.Rotation) : 0;

	const [angle, angleMotor] = useMotion(originalAngle);
	const [hovered, setHovered] = useState(false);

	useEffect(() => {
		if (props.useButtonContext) setHovered(buttonHovered);
	}, [buttonHovered]);

	useEffect(() => {
		angleMotor.spring(
			buttonHovered ? originalAngle + (props.angle ?? 10) * getPositiveOrNegative() : originalAngle,
			springs.responsive,
		);
	}, [hovered]);

	const frameProps: ExcludedProps<FrameProps, HoverTiltProps> = {
		...props,
		useButtonContext: undefined,
		angle: undefined,
	};

	return (
		<Frame
			{...frameProps}
			BackgroundTransparency={1}
			Rotation={useBindingState(angle)}
			Event={{
				MouseEnter: () => {
					if (!props.useButtonContext) setHovered(true);
				},
			}}
		>
			{props.children}
		</Frame>
	);
}
