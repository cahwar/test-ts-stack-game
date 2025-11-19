import React, { useEffect } from "@rbxts/react";
import { SpringOptions } from "@rbxts/ripple";
import { Frame, FrameProps } from "./frame";
import { MountDelay } from "./mount-delay";
import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import { springs } from "shared/constants/ui/springs";
import { useNativeProps } from "client/ui/hooks/use-native-props";

export interface AnimatedFrameProps extends FrameProps {
	enabled: boolean;
	ignoreScale?: boolean;
	ignorePosition?: boolean;
	unmountedPosition?: UDim2;
	springConfig?: SpringOptions;
}

export function AnimatedFrame(props: AnimatedFrameProps) {
	const [alpha, alphaMotor] = useMotion(0);

	useEffect(() => {
		alphaMotor.spring(props.enabled ? 1 : 0, props.springConfig ?? springs.responsive);
	}, [props.enabled]);

	const nativeProps = useNativeProps(props);

	return (
		<MountDelay shouldRender={props.enabled} unmountDelay={0.5}>
			<Frame {...nativeProps} BackgroundTransparency={1}>
				<Frame
					BackgroundTransparency={props.BackgroundTransparency}
					BackgroundColor3={props.BackgroundColor3}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={lerpBinding(
						props.ignorePosition === true ? 1 : alpha,
						props.unmountedPosition ?? UDim2.fromScale(0.5, 2),
						UDim2.fromScale(0.5, 0.5),
					)}
					Size={lerpBinding(
						props.ignoreScale === true ? 1 : alpha,
						UDim2.fromScale(0, 0),
						UDim2.fromScale(1, 1),
					)}
					cornerRadius={props.cornerRadius}
					useStroke={props.useStroke}
					strokeSize={props.strokeSize}
					strokeColor={props.strokeColor}
				>
					{props.children}
				</Frame>
			</Frame>
		</MountDelay>
	);
}
