import React, { useEffect } from "@rbxts/react";
import { SpringOptions } from "@rbxts/ripple";
import { Frame, FrameProps } from "./frame";
import { ExcludedProps } from "client/ui/types";
import { MountDelay } from "./mount-delay";
import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import { springs } from "shared/constants/ui/springs";

export interface AnimatedFrameProps extends FrameProps {
	springConfig: SpringOptions;
	enabled: boolean;
}

export function AnimatedFrame(props: AnimatedFrameProps) {
	const [alpha, alphaMotor] = useMotion(0);

	useEffect(() => {
		alphaMotor.spring(props.Visible ? 1 : 0, props.springConfig ?? springs.responsive);
	}, [props.Visible]);

	const frameProps: ExcludedProps<FrameProps, AnimatedFrameProps> = {
		...props,
		springConfig: undefined,
		enabled: undefined,
	};

	return (
		<MountDelay shouldRender={props.enabled}>
			<Frame
				{...frameProps}
				Position={lerpBinding(alpha, UDim2.fromScale(0, -1.5), props.Position ?? UDim2.fromScale(0.5, 0.5))}
			>
				{props.children}
			</Frame>
		</MountDelay>
	);
}
