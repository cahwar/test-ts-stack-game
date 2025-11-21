import { Controller } from "@flamework/core";
import { StoreController } from "./store.controller";

@Controller()
export class MonetizationController {
	constructor(private readonly storeController: StoreController) {}

	hasPass(id: number): boolean {
		return this.storeController.getValue("passes").expect().has(tostring(id));
	}
}
