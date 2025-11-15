import { Modding, OnStart, Service } from "@flamework/core";
import { OnPlayerJoined, OnPlayerRemoving } from "./player-lifecycle.service";
import { Events } from "server/network";
import { PlayerAtomStore } from "shared/utils/player-atom-store";
import { sharedAtoms } from "shared/state-sync/atoms";

const COOLDOWN = 0.17;

export interface OnClick {
	onClick(player: Player): void;
}

@Service()
export class ClickService implements OnStart, OnPlayerJoined, OnPlayerRemoving {
	private onClickListeners: Set<OnClick> = new Set();
	private latestClickTicks = new PlayerAtomStore<number>();

	onStart(): void {
		Modding.onListenerAdded<OnClick>((listener) => this.onClickListeners.add(listener));

		Events.Click.connect((player) => {
			if (this.isOnCooldown(player)) return;
			this.click(player);
		});
	}

	onPlayerJoined(player: Player): void {
		sharedAtoms.clickCooldown((prev) => ({ ...prev, [tostring(player.UserId)]: COOLDOWN }));

		this.latestClickTicks.set(player, 0);
	}

	onPlayerRemoving(player: Player): void {
		sharedAtoms.clickCooldown((prev) => ({ ...prev, [tostring(player.UserId)]: undefined }));

		this.latestClickTicks.remove(player);
	}

	isOnCooldown(player: Player) {
		const latestTick = this.latestClickTicks.get(player) ?? 0;
		return tick() - latestTick < this.getCooldown(player);
	}

	getCooldown(player: Player) {
		return sharedAtoms.clickCooldown()[tostring(player.UserId)] ?? COOLDOWN;
	}

	setLatestTick(player: Player) {
		this.latestClickTicks.set(player, tick());
	}

	click(player: Player) {
		this.setLatestTick(player);
		this.onClickListeners.forEach((listener) => listener.onClick(player));
	}
}
