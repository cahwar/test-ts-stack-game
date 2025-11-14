import { Controller, OnStart } from "@flamework/core";
import { StoreController } from "./store.controller";
import { subscribe } from "@rbxts/charm";
import { PopUpController } from "./pop-up.controller";
import { POWER_ICON } from "shared/constants/ui/icons";

@Controller()
export class PowerClickerController implements OnStart {
	constructor(
		private readonly storeController: StoreController,
		private readonly popUpController: PopUpController,
	) {}

	onStart(): void {
		subscribe(
			() => this.storeController.getValue("power").expect(),
			(value) => warn("power", value),
		);

		this.popUpController.subscribePopValue(() => this.storeController.getValue("power").expect(), POWER_ICON);
	}
}
