import { Service } from "@flamework/core";
import { OnPlayerJoined } from "./player-lifecycle.service";
import { BonusService } from "./bonus.service";
import { StoreService } from "./store.service";
import { measureExecutionSpeed } from "shared/utils/functions/measure-execution-speed";

@Service()
export class RebirthService implements OnPlayerJoined {
	constructor(
		private readonly bonusService: BonusService,
		private readonly storeService: StoreService,
	) {}

	onPlayerJoined(player: Player): void {
		this.storeService.watch(player, "rebirthCount", (value) => {
			if (value === 0) this.bonusService.removeBonus(player, "power", "Rebirth");
			else this.bonusService.setBonus(player, "power", "Rebirth", 0.3 * value);
		});
	}
}
