import { Controller } from "@flamework/core";
import { StoreController } from "./store.controller";

import { PopUpController } from "./pop-up.controller";

@Controller()
export class PowerClickerController {
	constructor(
		private readonly storeController: StoreController,
		private readonly popUpController: PopUpController,
	) {}
}
