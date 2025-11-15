import { Controller } from "@flamework/core";
import { atom } from "@rbxts/charm";
import { setTimeout } from "@rbxts/set-timeout";
import { getUniqueId } from "shared/utils/functions/get-unique-id";

const REMOVAL_DELAY = 0.5;

export interface FloaterData {
	adornee?: Instance;
	visible: boolean;
	text: string;
	icon: string;
	id: string;
}

@Controller()
export class FloaterController {
	private floaters = atom<FloaterData[]>([]);

	get() {
		return this.floaters();
	}

	add(text: string, icon: string, adornee?: Instance, timeout: number = 0.9) {
		const id = getUniqueId();

		this.floaters((prev) => [...prev, { text, icon, adornee, id, visible: true }]);

		setTimeout(() => this.dismiss(id), timeout);
	}

	dismiss(id: string) {
		this.floaters((prev) =>
			prev.map((floaterData) => {
				if (floaterData.id !== id) return floaterData;
				return { ...floaterData, visible: false };
			}),
		);

		setTimeout(() => {
			this.remove(id);
		}, REMOVAL_DELAY);
	}

	private remove(id: string) {
		this.floaters((prev) => [...prev.filter((floaterData) => floaterData.id !== id)]);
	}
}
