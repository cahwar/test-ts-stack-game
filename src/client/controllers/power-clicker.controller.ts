import { Controller, OnStart } from "@flamework/core";
import { StoreController } from "./store.controller";
import { subscribe } from "@rbxts/charm";

@Controller()
export class PowerClickerController implements OnStart {
	constructor(private readonly storeController: StoreController) {}

	onStart(): void {
		subscribe(
			() => this.storeController.getValue("power").expect(),
			(value) => warn("power", value),
		);
	}
}
