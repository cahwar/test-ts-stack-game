import { Controller, OnStart, Modding } from "@flamework/core";
import { UserInputService } from "@rbxts/services";
import { Events } from "client/network";
import { StoreController } from "./store.controller";
import { GetWeaponConfig } from "shared/constants/configs/weapon.config";
import { getPlatform } from "shared/utils/functions/get-platform";

export interface OnClick {
	onClick(): void;
}

@Controller()
export class ClickerController implements OnStart, OnClick {
	private onClickListeners: Set<OnClick> = new Set();
	private latestClickTick = 0;

	constructor(private readonly storeController: StoreController) {}

	onStart() {
		Modding.onListenerAdded<OnClick>((listener) => this.onClickListeners.add(listener));

		const platform = getPlatform();

		if (platform === "Desktop" || platform === "Console") {
			UserInputService.InputBegan.Connect((inputObject: InputObject, gameProcessedEvent: boolean) => {
				if (gameProcessedEvent) return;
				if (
					inputObject.UserInputType !== Enum.UserInputType.MouseButton1 &&
					inputObject.KeyCode !== Enum.KeyCode.ButtonR1
				)
					return;

				this.attemptClick();
			});
		} else {
			UserInputService.TouchTapInWorld.Connect((_, processedByUI) => {
				if (processedByUI) return;
				this.attemptClick();
			});
		}
	}

	attemptClick(): void {
		if (this.isOnCooldown()) return;
		this.click();
	}

	onClick(): void {
		Events.Click.fire();
	}

	private isOnCooldown(): boolean {
		return tick() - this.latestClickTick < this.getCooldown();
	}

	private getCooldown(): number {
		const weapon = this.storeController.getValue("weapon").expect();
		return GetWeaponConfig(weapon)?.cooldown ?? 0.5;
	}

	private setCooldown(): void {
		this.latestClickTick = tick();
	}

	private click(): void {
		this.setCooldown();

		this.onClickListeners.forEach((listener) => listener.onClick());
	}
}
