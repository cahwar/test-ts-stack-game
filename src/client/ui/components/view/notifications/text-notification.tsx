import React, { useEffect } from "@rbxts/react";
import { Text } from "../../composables/text";
import { Frame } from "../../composables/frame";
import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import { springs } from "shared/constants/ui/springs";
import { DelayRender } from "../../composables/delay-render";

export interface TextNotificationProps {
	LayoutOrder: number;
	Message: string;
	Visible: boolean;
}

const WIDTH = 1;
const HEIGHT = 0.45;

export function TextNotification(props: TextNotificationProps) {
	const [scale, scaleMotor] = useMotion(0);

	useEffect(() => {
		scaleMotor.spring(props.Visible ? 1 : 0, springs.stiff);
	}, [props.Visible]);

	return (
		<DelayRender ShouldRender={props.Visible} UnmountDelay={1}>
			<Frame
				BackgroundTransparency={1}
				Size={lerpBinding(scale, UDim2.fromScale(0, 0), UDim2.fromScale(WIDTH, HEIGHT))}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				LayoutOrder={props.LayoutOrder}
			>
				<Text
					Size={UDim2.fromScale(1, 1)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					StrokeSize={2}
					Text={props.Message}
					TextScaled={true}
				></Text>
			</Frame>
		</DelayRender>
	);
}
