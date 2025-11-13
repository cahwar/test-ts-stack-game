import { Service } from "@flamework/core";
import { OnClick } from "./clicker.service";
import { StoreService } from "./store.service";

@Service()
export class PowerClickerService implements OnClick {
	constructor(private readonly storeService: StoreService) {}

	onClick(player: Player): void {
		this.storeService.updateValue(player, "power", (value) => value + math.random(3, 5));
	}
}
