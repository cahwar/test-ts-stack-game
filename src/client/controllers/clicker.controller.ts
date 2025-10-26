import { Controller, OnStart } from "@flamework/core";
import { UserInputService } from "@rbxts/services";
import { Events } from "client/network";

@Controller()
export class ClickerController implements OnStart {
	private latestClickTick = 0;

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
