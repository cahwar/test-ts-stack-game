import { Controller, OnStart } from "@flamework/core";
import { StoreController } from "./store.controller";

import { PopUpController } from "./pop-up.controller";
import { POWER_ICON } from "shared/constants/ui/icons";

@Controller()
export class PowerClickerController implements OnStart {
	constructor(
		private readonly storeController: StoreController,
		private readonly popUpController: PopUpController,
	) {}

	onStart(): void {
		this.popUpController.subscribePopValue(() => this.storeController.getValue("power").expect(), POWER_ICON);
	}
}
