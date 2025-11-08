import React from "@rbxts/react";
import { Dependency } from "@flamework/core";
import { useAtom } from "@rbxts/react-charm";
import { NotificationController } from "client/controllers/notification.controller";
import { Layer } from "../../composables/layer";
import { TextNotificationsList } from "./text-notifications-list";

export function Notifications() {
	const controller = Dependency<NotificationController>();
	const dismiss = (id: string) => controller.dismiss(id);
	const notifications = useAtom(() => controller.getNotifications());

	return (
		<Layer DisplayOrder={1000} IgnoreGuiInset={false}>
			<TextNotificationsList Notifications={notifications} Dismiss={dismiss}></TextNotificationsList>
		</Layer>
	);
}
