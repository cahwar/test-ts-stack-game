import React, { useEffect } from "@rbxts/react";
import { NotificationData } from "client/controllers/notification.controller";
import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import { springs } from "shared/constants/ui/springs";
import { TypewriteText } from "../../composables/typewrite-text";

const SCALE_SIZE = UDim2.fromScale(1, 0.3);

export interface TextNotificationProps {
	data: NotificationData;
	dismisss?: (id: string) => void;
	layoutOrder?: number;
}

export function TextNotification(props: TextNotificationProps) {
	const [scale, scaleMotor] = useMotion(0);

	useEffect(() => {
		scaleMotor.spring(props.data.visible ? 1 : 0, springs.responsive);
	}, [props.data.visible]);

	return (
		<imagebutton
			LayoutOrder={props.layoutOrder}
			BackgroundTransparency={1}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Size={lerpBinding(scale, UDim2.fromScale(0, 0), SCALE_SIZE)}
			Event={{
				MouseButton1Click: () => {
					props.dismisss?.(props.data.id);
				},
			}}
		>
			<TypewriteText
				Text={props.data.message}
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
