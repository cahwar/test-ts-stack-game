import React from "@rbxts/react";
import { BindedProperty, ExcludedProps } from "client/ui/types";
import { FrameProps } from "./frame";
import { Frame } from "./frame";
import { CENTER_HIGHLIGHTED } from "shared/constants/ui/palette";
import { useBindedProperty } from "client/ui/hooks/use-binded-property";
import { useBindingListener, useMotion } from "@rbxts/pretty-react-hooks";
import { Text } from "./text";

export interface ProgressBarProps extends FrameProps {
	current: React.Binding<number>;
	goal: number;
	fillerColor?: BindedProperty<Color3>;
	gradientRotation?: number;
	showProgressText?: boolean;
}

export function ProgressBar(props: ProgressBarProps) {
	const [offsetAlpha, offsetAlphaMotor] = useMotion(0);

	useBindingListener(props.current, (value) => {
		offsetAlphaMotor.tween(value / props.goal, {
			time: 0.15,
			style: Enum.EasingStyle.Quad,
			direction: Enum.EasingDirection.Out,
		});
	});

	const frameProps: ExcludedProps<FrameProps, ProgressBarProps> = {
		...props,
		gradientRotation: undefined,
		showProgressText: undefined,
		fillerColor: undefined,
		current: undefined,
		goal: undefined,
	};

	return (
		<Frame {...frameProps}>
			<Frame Size={UDim2.fromScale(1, 1)} cornerRadius={props.cornerRadius}>
				<uigradient
					Color={CENTER_HIGHLIGHTED(useBindedProperty(props.fillerColor ?? Color3.fromRGB(100, 255, 100)))}
					Rotation={props.gradientRotation}
					Offset={offsetAlpha.map((value) => new Vector2(-0.5 + value, 0))}
					Transparency={
						new NumberSequence([
							new NumberSequenceKeypoint(0, 0),
							new NumberSequenceKeypoint(0.499, 0),
							new NumberSequenceKeypoint(0.5, 1),
							new NumberSequenceKeypoint(1, 1),
						])
					}
				/>

				{props.showProgressText && (
					<Text
						Text={props.current.map((value) => `${value} / ${props.goal}`)}
						Size={UDim2.fromScale(0.8, 0.8)}
						Position={UDim2.fromScale(0.5, 0.5)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						TextScaled={true}
					/>
				)}

				{props.children}
			</Frame>
		</Frame>
	);
}
