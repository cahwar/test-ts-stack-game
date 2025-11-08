import React from "@rbxts/react";
import { Layer } from "../../composables/layer";
import { NotificationList } from "./notificationList";
import { useAtom } from "@rbxts/react-charm";
import { Dependency } from "@flamework/core";
import { NotificationController } from "client/controllers/notification.controller";

export function Notifications() {
	const notifications = useAtom(() => Dependency<NotificationController>().getNotifications());

	return (
		<Layer DisplayOrder={1000}>
			<NotificationList Notifications={notifications}></NotificationList>
		</Layer>
	);
}
