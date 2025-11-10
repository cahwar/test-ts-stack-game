import React from "@rbxts/react";
import { FrameProps } from "../../composables/frame";
import { AnimatedFrame } from "../../composables/animated-frame";

export interface PageActivityProps {
	enabled: boolean;
}

export interface PageProps extends FrameProps, PageActivityProps {
	unmountedPosition?: UDim2;
}

export function Page(props: PageProps) {
	return <AnimatedFrame {...props}>{props.children}</AnimatedFrame>;
}
