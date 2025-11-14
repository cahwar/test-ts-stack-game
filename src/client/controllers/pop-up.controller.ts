import { Controller } from "@flamework/core";
import { atom, Selector, subscribe } from "@rbxts/charm";
import { setTimeout } from "@rbxts/set-timeout";
import { NEGATIVE_COLOR, POSITIVE_COLOR } from "shared/constants/ui/palette";
import { getUniqueId } from "shared/utils/functions/get-unique-id";
import { getColoredString } from "shared/utils/text-utils";

const REMOVE_DELAY = 0.5;

export interface PopUpData {
	visible: boolean;
	text: string;
	icon: string;
	id: string;
}

@Controller()
export class PopUpController {
	private popUps = atom<PopUpData[]>([]);

	get(): Array<PopUpData> {
		return this.popUps();
	}

	add(text: string, icon: string, timeout: number = 0.9): void {
		const id = getUniqueId();
		this.popUps((prevState) => [...prevState, { text, icon, id, visible: true }]);
		setTimeout(() => this.dismiss(id), timeout);
	}

	dismiss(id: string): void {
		this.popUps((prevState) =>
			prevState.map((popUp) => {
				if (popUp.id !== id) return popUp;
				return { ...popUp, visible: false };
			}),
		);

		setTimeout(() => this.remove(id), REMOVE_DELAY);
	}

	private remove(id: string): void {
		this.popUps((prevState) => [...prevState.filter((popUp) => popUp.id !== id)]);
	}

	subscribePopValue(selector: Selector<number>, icon: string = "") {
		subscribe(selector, (state, prev) => {
			const text = getColoredString(
				`${prev > state ? "-" : "+"}${math.abs(state - prev)}`,
				prev > state ? NEGATIVE_COLOR : POSITIVE_COLOR,
			);
			this.add(text, icon);
		});
	}
}
