import { Service } from "@flamework/core";
import { OnPlayerRemoving } from "./player-lifecycle.service";
import { sharedAtoms } from "shared/state-sync/atoms";

@Service()
export class BonusService implements OnPlayerRemoving {
	onPlayerRemoving(player: Player): void {
		this.clearPlayer(player);
	}

	getValueWithBonus(player: Player, valueName: string, amount: number): number {
		return amount + amount * (this.getTotalBonus(player, valueName) / 100);
	}

	getTotalBonus(player: Player, valueName: string): number {
		const userId = tostring(player.UserId);
		const bonuses = sharedAtoms.bonuses()[userId];

		if (bonuses === undefined) {
			return 0;
		}

		let total = 0;

		bonuses.forEach((bonusData) => {
			if (bonusData.valueName === valueName) total += bonusData.percent;
		});

		return total;
	}

	setBonus(
		player: Player,
		valueName: string,
		bonusName: string,
		percent: number,
		icon?: string,
		displayName?: string,
		description?: string,
	): void {
		const userId = tostring(player.UserId);

		sharedAtoms.bonuses((state) => {
			const userState = state[userId] ? [...state[userId]] : [];

			userState.remove(userState.findIndex((bonusData) => bonusData.bonusName === bonusName));
			userState.push({ valueName, bonusName, percent, icon, displayName, description });

			return { ...state, [userId]: userState };
		});
	}

	removeBonus(player: Player, valueName: string, bonusName: string): void {
		const userId = tostring(player.UserId);

		sharedAtoms.bonuses((state) => {
			const userState = state[userId] ? [...state[userId]] : [];
			userState.remove(userState.findIndex((bonusData) => bonusData.bonusName === bonusName));
			return { ...state, [userId]: [...userState] };
		});
	}

	clearPlayer(player: Player): void {
		const userId = tostring(player.UserId);

		sharedAtoms.bonuses((prev) => ({ ...prev, [userId]: undefined }));
	}
}
