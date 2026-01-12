import { Service } from "@flamework/core";
import { OnClick } from "./clicker.service";
import { StoreService } from "./store.service";
import { WeaponService } from "./weapon.service";

@Service()
export class PowerClickerService implements OnClick {
	constructor(
		private readonly storeService: StoreService,
		private readonly weaponService: WeaponService,
	) {}

	onClick(player: Player): void {
		const increment = this.getIncrement(player);
		if (increment === undefined) return;

		this.storeService.updateValue(player, "power", (value) => value + increment);
	}

	private getIncrement(player: Player): number | void {
		let powerIncrement = 0;

		const config = this.weaponService.getEquippedConfig(player);
		if (config !== undefined) powerIncrement = config.powerIncrement;

		const rebirthCount = this.storeService.getValue(player, "rebirthCount").expect() ?? 0;
		if (rebirthCount > 0) powerIncrement *= 1 + 0.1 * rebirthCount;

		return powerIncrement;
	}
}
