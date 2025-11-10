import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { InferProps } from "@rbxts/ui-labs";
import { TextNotificationsList } from "../view/text-notifications/text-notifications-list";
import { NotificationData } from "client/controllers/notification.controller";
import { getUniqueId } from "shared/utils/functions/get-unique-id";

const controls = {
	amount: 1,
};

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls: controls,
	story: (props: InferProps<typeof controls>) => {
		const mockNotifications = new Array<NotificationData>();
		for (let i = 0; i < props.controls.amount; i++) {
			mockNotifications.push({ id: getUniqueId(), message: `Hello, world! #${i}`, visible: true });
		}

		return <TextNotificationsList notifications={mockNotifications} dismiss={() => {}}></TextNotificationsList>;
	},
};

export = story;
