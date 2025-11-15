import { Controller, OnStart, Modding } from "@flamework/core";
import { Players, UserInputService } from "@rbxts/services";
import { Events } from "client/network";
import { sharedAtoms } from "shared/state-sync/atoms";

export interface OnClick {
	onClick(): void;
}

@Controller()
export class ClickerController implements OnStart, OnClick {
	private onClickListeners: Set<OnClick> = new Set();
	private latestClickTick = 0;

	onStart() {
		Modding.onListenerAdded<OnClick>((listener) => this.onClickListeners.add(listener));

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
	}

	onClick(): void {
		Events.Click.fire();
	}

	private isOnCooldown() {
		return tick() - this.latestClickTick < this.getCooldown();
	}

	private getCooldown() {
		return sharedAtoms.clickCooldown()[tostring(Players.LocalPlayer.UserId)] ?? 0.4;
	}

	private setCooldown() {
		this.latestClickTick = tick();
	}

	private click() {
		this.setCooldown();

		this.onClickListeners.forEach((listener) => listener.onClick());
	}
}
