import React from "@rbxts/react";
import { FrameProps } from "../../composables/frame";
import { TransitionMountFrame } from "../../composables/transition-mount-frame";

const MOUNT_DELAY = 0;
const UNMOUNT_DELAY = 0.5;

export interface PageToggleProps {
	Enabled: boolean;
}

export interface PageProps extends FrameProps, PageToggleProps {
	UnmountedPosition?: UDim2;
}

export function Page(props: PageProps) {
	return (
		<TransitionMountFrame MountDelay={MOUNT_DELAY} UnmountDelay={UNMOUNT_DELAY} {...props}>
			{props.children}
		</TransitionMountFrame>
	);
}
