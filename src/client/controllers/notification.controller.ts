import { Controller, OnStart } from "@flamework/core";
import { atom } from "@rbxts/charm";
import { setTimeout } from "@rbxts/set-timeout";
import { Events } from "client/network";
import { getUniqueId } from "shared/utils/functions/get-unique-id";

export interface NotificationData {
	message: string;
	duration: number;
	visible: boolean;
	id: string;
}

@Controller()
export class NotificationController implements OnStart {
	public notifications = atom<Array<NotificationData>>([]);

	onStart(): void {
		Events.Notifications.Add.connect((message: string, duration: number) => this.add(message, duration));

		task.delay(2, () => {
			this.add("hello, world", 1000);
		});
		// task.spawn(() => {
		// 	while (true) {
		// 		this.add("hello, world", 1.5);
		// 		task.wait(2);
		// 	}
		// });
	}

	add(message: string, duration: number): void {
		const id = getUniqueId();
		this.notifications((notifications) => [...notifications, { message, duration, id, visible: true }]);
		setTimeout(() => this.dismiss(id), duration);
	}

	dismiss(id: string): void {
		this.notifications((notifications) =>
			notifications.map((notification) => {
				return notification.id === id ? { ...notification, visible: false } : notification;
			}),
		);

		task.delay(1, () => this.remove(id));

		task.delay(2, () => {
			this.add("hello, world", 1000);
		});
	}

	remove(id: string): void {
		this.notifications((notifications) => [...notifications.filter((value) => value.id !== id)]);
	}

	getNotifications(): Array<NotificationData> {
		return this.notifications();
	}
}
