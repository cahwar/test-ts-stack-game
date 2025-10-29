import { Controller, OnStart } from "@flamework/core";
import { UserInputService } from "@rbxts/services";
import { Events } from "client/network";
import { StoreController } from "./store.controller";
import { subscribe } from "@rbxts/charm";

@Controller()
export class ClickerController implements OnStart {
	private latestClickTick = 0;

	constructor(private readonly storeController: StoreController) {}

	public onStart() {
		UserInputService.InputBegan.Connect((inputObject: InputObject, gameProcessedEvent: boolean) => {
			if (gameProcessedEvent) return;
			if (
				inputObject.UserInputType !== Enum.UserInputType.MouseButton1 &&
				inputObject.UserInputType !== Enum.UserInputType.Touch
			)
				return;
			if (this.isOnCooldown()) return;

			this.click();
		});

		subscribe(
			() => this.storeController.getValueAsync("coins"),
			(coins) => warn("coins", coins),
		);
	}

	private isOnCooldown() {
		return tick() - this.latestClickTick < 0.3;
	}

	private setCooldown() {
		this.latestClickTick = tick();
	}

	private click() {
		this.setCooldown();

		Events.Click.fire();
	}
}
