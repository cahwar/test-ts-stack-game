import { Controller, OnStart } from "@flamework/core";
import { atom, computed } from "@rbxts/charm";
import { setTimeout } from "@rbxts/set-timeout";
import { Events } from "client/network";
import { getUniqueId } from "shared/utils/functions/get-unique-id";

export interface NotificationData {
	message: string;
	visible: boolean;
	id: string;
}

const REMOVAL_DELAY = 1;
const MAX_NOTIFICATIONS = 3;

@Controller()
export class NotificationController implements OnStart {
	public notifications = atom<Array<NotificationData>>([]);
	private visibleNotifications = computed(() => this.notifications().filter((data) => data.visible));

	onStart(): void {
		Events.Notifications.Add.connect((message: string, duration: number) => this.add(message, duration));
	}

	add(message: string, duration: number): void {
		const id = getUniqueId();

		if (this.visibleNotifications().size() >= MAX_NOTIFICATIONS) {
			this.dismiss(this.visibleNotifications()[0]?.id);
		}

		this.notifications((notifications) => [...notifications, { message, id, visible: true }]);
		setTimeout(() => this.dismiss(id), duration);
	}

	dismiss(id: string): void {
		this.notifications((notifications) =>
			notifications.map((notification) => {
				if (notification.id !== id) return notification;
				return { ...notification, visible: false };
			}),
		);

		task.delay(REMOVAL_DELAY, () => this.remove(id));
	}

	remove(id: string): void {
		this.notifications((notifications) => [...notifications.filter((value) => value.id !== id)]);
	}

	getNotifications(): Array<NotificationData> {
		return this.notifications();
	}

	getVisibleNotifications(): Array<NotificationData> {
		return this.visibleNotifications();
	}
}
