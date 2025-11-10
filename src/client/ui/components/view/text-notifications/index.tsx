import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { NotificationController } from "client/controllers/notification.controller";
import { Layer } from "../../composables/layer";
import { TextNotificationsList } from "./text-notifications-list";
import { useFlameworkDependency } from "client/ui/hooks/use-flamework-dependency";

export function Notifications() {
	const controller = useFlameworkDependency<NotificationController>();
	const dismiss = (id: string) => controller.dismiss(id);
	const notifications = useAtom(() => controller.getNotifications());

	return (
		<Layer DisplayOrder={1000} IgnoreGuiInset={false}>
			<TextNotificationsList notifications={notifications} dismiss={dismiss}></TextNotificationsList>
		</Layer>
	);
}
