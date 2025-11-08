import React, { useEffect } from "@rbxts/react";
import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import { springs } from "shared/constants/ui/springs";
import { DelayRender } from "../../composables/delay-render";
import { TypewriteText } from "../../composables/typewrite-text";

export interface TextNotificationProps {
	LayoutOrder: number;
	Message: string;
	Visible: boolean;
	Id: string;
	Dismiss: (id: string) => void;
}

const WIDTH = 1;
const HEIGHT = 0.45;

export function TextNotification(props: TextNotificationProps) {
	warn("rerender text notification", props.Id);
	const [scale, scaleMotor] = useMotion(0);

	useEffect(() => {
		scaleMotor.spring(props.Visible ? 1 : 0, springs.stiff);
	}, [props.Visible]);

	return (
		<DelayRender ShouldRender={props.Visible} UnmountDelay={1}>
			<imagebutton
				Event={{ MouseButton1Click: () => props.Dismiss(props.Id) }}
				BackgroundTransparency={1}
				Size={lerpBinding(scale, UDim2.fromScale(0, 0), UDim2.fromScale(WIDTH, HEIGHT))}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				LayoutOrder={props.LayoutOrder}
			>
				<TypewriteText
					Size={UDim2.fromScale(1, 1)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					StrokeSize={2}
					Text={props.Message}
					TextScaled={true}
				></TypewriteText>
			</imagebutton>
		</DelayRender>
	);
}
