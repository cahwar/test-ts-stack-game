import React from "@rbxts/react";
import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import { useEffect } from "@rbxts/react";
import { springs } from "shared/constants/ui/springs";
import { Frame, FrameProps } from "./frame";
import { DelayRender } from "./delay-render";
import { SpringOptions } from "@rbxts/ripple";

const MOUNT_DELAY = 0;
const UNMOUNT_DELAY = 0.5;
const UNMOUNTED_POSITION = UDim2.fromScale(0.5, 1.5);
const UNMOUNTED_SIZE = UDim2.fromScale(0, 0);

export interface TransitionMountFrameProps extends FrameProps {
	Enabled: boolean;
	UnmountedPosition?: UDim2;
	MountDelay?: number;
	UnmountDelay?: number;
	SpringConfig?: SpringOptions;
}

export function TransitionMountFrame(props: TransitionMountFrameProps) {
	const [scale, scaleMotor] = useMotion(0);

	useEffect(() => {
		scaleMotor.spring(props.Enabled ? 1 : 0, props.SpringConfig ?? springs.responsive);
	}, [props.Enabled]);

	const frameProps = {
		...props,
		Enabled: undefined,
		MountDelay: undefined,
		UnmountDelay: undefined,
		SpringConfig: undefined,
		UnmountedPosition: undefined,
	};

	return (
		<DelayRender
			ShouldRender={props.Enabled}
			MountDelay={props.MountDelay ?? MOUNT_DELAY}
			UnmountDelay={props.UnmountDelay ?? UNMOUNT_DELAY}
		>
			<Frame
				{...frameProps}
				Position={lerpBinding(scale, props.UnmountedPosition ?? UNMOUNTED_POSITION, props.Position as UDim2)}
				Size={lerpBinding(scale, UNMOUNTED_SIZE, props.Size as UDim2)}
			>
				{props.children}
			</Frame>
		</DelayRender>
	);
}
