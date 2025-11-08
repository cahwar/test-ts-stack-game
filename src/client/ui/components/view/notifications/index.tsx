import React from "@rbxts/react";
import { Layer } from "../../composables/layer";
import { NotificationList } from "./notificationList";
import { useAtom } from "@rbxts/react-charm";
import { Dependency } from "@flamework/core";
import { NotificationController } from "client/controllers/notification.controller";

export function Notifications() {
	warn("Rerender notification main");

	const controller = Dependency<NotificationController>();
	const notifications = useAtom(() => controller.getNotifications());
	const dismiss = (id: string) => controller.dismiss(id);

	return (
		<Layer DisplayOrder={1000} IgnoreGuiInset={false}>
			<NotificationList Notifications={notifications} Dismiss={dismiss}></NotificationList>
		</Layer>
	);
}
