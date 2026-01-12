import { Service } from "@flamework/core";
import { OnClick } from "./clicker.service";
import { StoreService } from "./store.service";
import { WeaponService } from "./weapon.service";
import { BonusService } from "./bonus.service";

@Service()
export class PowerClickerService implements OnClick {
	constructor(
		private readonly storeService: StoreService,
		private readonly weaponService: WeaponService,
		private readonly bonusService: BonusService,
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

		return this.bonusService.getValueWithBonus(player, "power", powerIncrement);
	}
}
