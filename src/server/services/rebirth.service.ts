import { OnInit, Service } from "@flamework/core";
import { OnPlayerJoined } from "./player-lifecycle.service";
import { BonusService } from "./bonus.service";
import { StoreService } from "./store.service";
import { AdminService } from "./admin.service";

@Service()
export class RebirthService implements OnInit, OnPlayerJoined {
	constructor(
		private readonly bonusService: BonusService,
		private readonly storeService: StoreService,
		private readonly adminService: AdminService,
	) {}

	onInit(): void | Promise<void> {
		this.adminService.registerCommand("Force Rebirth", (player: Player) => {
			this.rebirth(player);
		});
	}

	onPlayerJoined(player: Player): void {
		this.storeService.watch(player, "rebirthCount", (value) => {
			if (value === 0) this.bonusService.removeBonus(player, "power", "Rebirth");
			else this.bonusService.setBonus(player, "power", "Rebirth", 10 * value);
		});
	}

	private rebirth(player: Player): void {
		this.storeService.updateData(player, (data) => {
			data.rebirthCount += 1;
			data.money = 0;
			data.power = 0;

			return true;
		});
	}
}
