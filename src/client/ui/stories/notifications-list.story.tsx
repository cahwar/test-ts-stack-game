import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { InferProps } from "@rbxts/ui-labs";
import { NotificationData } from "client/controllers/notification.controller";
import { NotificationList } from "../components/view/notifications/notificationList";
import { getUniqueId } from "shared/utils/functions/get-unique-id";

const controls = {
	notificationsCount: 3,
};

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls: controls,
	story: (props: InferProps<typeof controls>) => {
		const mockNotifications: Array<NotificationData> = [];

		for (let i = 0; i < props.controls.notificationsCount; i++) {
			mockNotifications.push({ message: "Hello, world!", visible: true, id: getUniqueId(), duration: 1 });
		}

		return <NotificationList Notifications={mockNotifications} Dismiss={() => {}}></NotificationList>;
	},
};

export = story;
