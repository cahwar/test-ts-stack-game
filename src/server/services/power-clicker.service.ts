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
		this.storeService.updateValue(player, "power", (value) => value + this.getIncrement(player));
	}

	private getIncrement(player: Player): number {
		return this.weaponService.getEquippedConfig(player).power;
	}
}
