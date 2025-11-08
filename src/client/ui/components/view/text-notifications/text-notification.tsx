import React, { useEffect } from "@rbxts/react";
import { NotificationData } from "client/controllers/notification.controller";
import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import { springs } from "shared/constants/ui/springs";
import { TypewriteText } from "../../composables/typewrite-text";

const SCALE_SIZE = UDim2.fromScale(1, 0.3);
const STROKE_SIZE = 2;

export interface TextNotificationProps {
	Data: NotificationData;
	Dismiss?: (id: string) => void;
	LayoutOrder?: number;
}

export function TextNotification(props: TextNotificationProps) {
	const [scale, scaleMotor] = useMotion(0);

	useEffect(() => {
		scaleMotor.spring(props.Data.visible ? 1 : 0, springs.responsive);
	}, [props.Data.visible]);

	return (
		<imagebutton
			LayoutOrder={props.LayoutOrder}
			BackgroundTransparency={1}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Size={lerpBinding(scale, UDim2.fromScale(0, 0), SCALE_SIZE)}
			Event={{
				MouseButton1Click: () => {
					props.Dismiss?.(props.Data.id);
				},
			}}
		>
			<TypewriteText
				Text={props.Data.message}
				StrokeSize={lerpBinding(scale, 0, STROKE_SIZE)}
				TextTransparency={scale.map((value) => 1 - value)}
				Size={UDim2.fromScale(1, 1)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				TextScaled={true}
				RichText={true}
			></TypewriteText>
		</imagebutton>
	);
}
