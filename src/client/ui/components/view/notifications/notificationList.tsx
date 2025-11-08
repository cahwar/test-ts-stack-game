import { usePx } from "client/ui/hooks/use-px";
import { Frame } from "../../composables/frame";
import React from "@rbxts/react";
import { NotificationData } from "client/controllers/notification.controller";
import { TextNotification } from "./text-notification";

const WIDTH = 400;
const HEIGHT = 150;
const ELEMENTS_PADDING = 15;

export interface NotificationListProps {
	Notifications: Array<NotificationData>;
}

export function NotificationList(props: NotificationListProps) {
	const px = usePx();

	const size1 = UDim2.fromOffset(px(WIDTH), px(HEIGHT));

	return (
		<Frame
			AnchorPoint={new Vector2(0.5, 1)}
			Position={new UDim2(0.5, 0, 1, -px(50))}
			Size={size1}
			BackgroundTransparency={1}
			ClipsDescendants={true}
		>
			<>
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Bottom}
					Padding={new UDim(0, px(ELEMENTS_PADDING))}
				></uilistlayout>

				{props.Notifications.map((data, index) => (
					<TextNotification
						LayoutOrder={index}
						Message={data.message + " " + data.id}
						key={data.id}
						Visible={data.visible}
					></TextNotification>
				))}
			</>
		</Frame>
	);
}
