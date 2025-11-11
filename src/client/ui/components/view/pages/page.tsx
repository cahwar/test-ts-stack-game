import React, { useEffect } from "@rbxts/react";
import { FrameProps } from "../../composables/frame";
import { AnimatedFrame } from "../../composables/animated-frame";
import { getSound } from "shared/utils/asset-utils";
import { playSound } from "shared/utils/sfx-utils";

const OPEN_SOUND = getSound("PageSwoosh");

export interface PageActivityProps {
	enabled: boolean;
}

export interface PageProps extends FrameProps, PageActivityProps {
	unmountedPosition?: UDim2;
}

export function Page(props: PageProps) {
	useEffect(() => {
		if (props.enabled) {
			playSound(OPEN_SOUND);
		}
	}, [props.enabled]);

	return <AnimatedFrame {...props}>{props.children}</AnimatedFrame>;
}
