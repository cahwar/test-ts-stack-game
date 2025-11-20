import { Controller, OnStart } from "@flamework/core";
import { atom, subscribe } from "@rbxts/charm";
import { setInterval } from "@rbxts/set-timeout";
import { ClickerController } from "./clicker.controller";

const INTERVAL = 0.5;

@Controller()
export class AutoClickController implements OnStart {
	private isActive = atom(false);
	private cleanupInterval: (() => void) | undefined = undefined;

	constructor(private readonly clickerController: ClickerController) {}

	onStart(): void {
		subscribe(this.isActive, (value) => {
			if (value) this.cleanupInterval = setInterval(() => this.clickerController.attemptClick(), INTERVAL);
			else this.cleanupInterval?.();
		});
	}

	getIsActive(): boolean {
		return this.isActive();
	}

	toggle(): void {
		this.isActive((value) => !value);
	}

	enable(): void {
		this.isActive(true);
	}

	disable(): void {
		this.isActive(false);
	}
}
