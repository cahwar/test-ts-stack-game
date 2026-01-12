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
		const bonuses = sharedAtoms.bonuses()[userId]?.[valueName];

		if (bonuses === undefined) return 0;

		let total = 0;

		bonuses.forEach((bonus) => (total += bonus.percent));

		return total;
	}

	setBonus(
		player: Player,
		valueName: string,
		bonusName: string,
		percent: number,
		icon?: string,
		displayName?: string,
	): void {
		const userId = tostring(player.UserId);

		sharedAtoms.bonuses((prev) => {
			const userBonuses = prev[userId] ?? {};

			if (userBonuses[valueName] === undefined) {
				userBonuses[valueName] = [];
			}

			const existingIndex = userBonuses[valueName].findIndex((bonusData) => bonusData.bonusName === bonusName);

			if (existingIndex !== undefined) {
				userBonuses[valueName].remove(existingIndex);
			}

			userBonuses[valueName].push({ bonusName, percent, icon, displayName });

			return { ...prev, [userId]: userBonuses };
		});
	}

	removeBonus(player: Player, valueName: string, bonusName: string): void {
		const userId = tostring(player.UserId);

		sharedAtoms.bonuses((prev) => {
			const userBonuses = prev[userId] ?? {};

			if (userBonuses[valueName] === undefined) {
				return prev;
			}

			const index = userBonuses[valueName].findIndex((value) => value.bonusName === bonusName);

			if (index === undefined) {
				return prev;
			}

			userBonuses[valueName].remove(index);

			return { ...prev, [userId]: userBonuses };
		});
	}

	clearPlayer(player: Player): void {
		const userId = tostring(player.UserId);

		sharedAtoms.bonuses((prev) => ({ ...prev, [userId]: undefined }));
	}
}
