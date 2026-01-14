import { Service } from "@flamework/core";
import { OnPlayerJoined, OnPlayerRemoving } from "./player-lifecycle.service";
import { sharedAtoms } from "shared/state-sync/atoms";
import { isExpiringBonusData } from "shared/interfaces/bonus.interface";
import { setInterval } from "@rbxts/set-timeout";

@Service()
export class BonusService implements OnPlayerRemoving, OnPlayerJoined {
	private checkIntervalCleanups: Record<string, (() => void) | undefined> = {};

	onPlayerJoined(player: Player): void {
		this.setExpiringBonus(player, "money", "Test Bonus", 15, 5);
	}

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

	setExpiringBonus(
		player: Player,
		valueName: string,
		bonusName: string,
		percent: number,
		expiresIn: number,
		icon?: string,
		displayName?: string,
		description?: string,
	): void {
		const userId = tostring(player.UserId);

		const userState = sharedAtoms.bonuses()[userId];

		if (userState) {
			const existingBonus = userState.find((bonusData) => bonusData.bonusName === bonusName);

			if (existingBonus !== undefined) {
				if (!isExpiringBonusData(existingBonus)) return;

				expiresIn += existingBonus.expiresIn - (os.time() - existingBonus.startTime);
			}
		}

		sharedAtoms.bonuses((state) => {
			const userState = state[userId] ? [...state[userId]] : [];

			userState.remove(userState.findIndex((bonusData) => bonusData.bonusName === bonusName));
			userState.push({
				valueName,
				bonusName,
				percent,
				icon,
				displayName,
				description,
				expiresIn,
				startTime: os.time(),
			});

			return { ...state, [userId]: userState };
		});

		if (this.checkIntervalCleanups[userId] === undefined) {
			this.initCheckInterval(player);
		}
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

		this.checkIntervalCleanups[userId]?.();
		this.checkIntervalCleanups[userId] = undefined;
	}

	private initCheckInterval(player: Player) {
		const userId = tostring(player.UserId);

		this.clearCheckInterval(player);

		this.checkIntervalCleanups[userId] = setInterval(() => {
			sharedAtoms.bonuses((state) => {
				const userState = state[userId] ? [...state[userId]] : undefined;

				if (userState === undefined) {
					this.clearCheckInterval(player);

					return state;
				}

				const expiredBonusNames = userState
					.filter(
						(bonusData) =>
							isExpiringBonusData(bonusData) && os.time() - bonusData.startTime >= bonusData.expiresIn,
					)
					.map((bonusData) => bonusData.bonusName);

				if (expiredBonusNames.size() <= 0) {
					this.clearCheckInterval(player);

					return state;
				}

				return {
					...state,
					[userId]: userState.filter((bonusData) => !expiredBonusNames.includes(bonusData.bonusName)),
				};
			});
		}, 5);
	}

	private clearCheckInterval(player: Player) {
		const userId = tostring(player.UserId);

		this.checkIntervalCleanups[userId]?.();
		this.checkIntervalCleanups[userId] = undefined;
	}
}
