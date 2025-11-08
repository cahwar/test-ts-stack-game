import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { InferProps } from "@rbxts/ui-labs";
import { NotificationData } from "client/controllers/notification.controller";
import { getUniqueId } from "shared/utils/functions/get-unique-id";
import { TextNotificationsList } from "../components/view/text-notifications/text-notifications-list";

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
			mockNotifications.push({ message: "Hello, world!" + " " + i, visible: true, id: getUniqueId() });
		}

		return <TextNotificationsList Notifications={mockNotifications} Dismiss={() => {}}></TextNotificationsList>;
	},
};

export = story;
