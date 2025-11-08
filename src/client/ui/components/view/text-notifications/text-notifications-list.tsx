import React from "@rbxts/react";
import { Frame } from "../../composables/frame";
import { NotificationData } from "client/controllers/notification.controller";
import { usePx } from "client/ui/hooks/use-px";
import { TextNotification } from "./text-notification";

const WIDTH = 420;
const HEIGHT = 200;
const EDGE_OFFSET = 50;
const PADDING = 15;

export interface TextNotificationsListProps {
	Notifications: Array<NotificationData>;
	Dismiss: (id: string) => void;
}

export function TextNotificationsList(props: TextNotificationsListProps) {
	const px = usePx();

	return (
		<Frame
			BackgroundTransparency={1}
			AnchorPoint={new Vector2(0.5, 0)}
			Position={new UDim2(0.5, 0, 0, px(EDGE_OFFSET))}
			Size={UDim2.fromOffset(px(WIDTH), px(HEIGHT))}
		>
			<>
				<uilistlayout
					SortOrder={Enum.SortOrder.LayoutOrder}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Top}
					FillDirection={Enum.FillDirection.Vertical}
					Padding={new UDim(0, px(PADDING))}
				></uilistlayout>

				{props.Notifications.map((data) => (
					<TextNotification
						Data={data}
						Dismiss={props.Dismiss}
						LayoutOrder={props.Notifications.indexOf(data)}
						key={data.id}
					></TextNotification>
				))}
			</>
		</Frame>
	);
}
