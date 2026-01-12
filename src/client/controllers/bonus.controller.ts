import { Controller } from "@flamework/core";
import { Players } from "@rbxts/services";
import { BonusData } from "shared/interfaces/bonus.interface";
import { sharedAtoms } from "shared/state-sync/atoms";

@Controller()
export class BonusController {
	private userId = tostring(Players.LocalPlayer.UserId);

	getBonuses(): Record<string, Array<BonusData>> {
		return sharedAtoms.bonuses()[this.userId] ?? {};
	}
}
