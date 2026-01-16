import { Service } from "@flamework/core";
import { OnPlayerJoined, OnPlayerRemoving } from "./player-lifecycle.service";
import { sharedAtoms } from "shared/state-sync/atoms";
import { BonusData, isExpiringBonusData } from "shared/interfaces/bonus.interface";
import { setInterval } from "@rbxts/set-timeout";
import { StoreService } from "./store.service";

@Service()
export class BonusService implements OnPlayerRemoving, OnPlayerJoined {
	private checkIntervalCleanups: Record<string, (() => void) | undefined> = {};

	constructor(private readonly storeService: StoreService) {}

	onPlayerJoined(player: Player): void {
		this.storeService.watch(player, "expiringBonuses", (expiringBonuses, previousBonuses) => {
			previousBonuses?.forEach((bonusData) => {
				if (isExpiringBonusData(bonusData) && os.time() - bonusData.startTime >= bonusData.expiresIn) {
					this.removeActiveBonus(player, bonusData.bonusName);
				}
			});

			expiringBonuses.forEach((bonusData) => {
				if (this.hasActiveBonus(player, bonusData.bonusName)) {
					return;
				}

				this.setActiveBonus(
					player,
					bonusData.valueName,
					bonusData.bonusName,
					bonusData.percent,
					bonusData.icon,
					bonusData.displayName,
					bonusData.description,
					bonusData.startTime,
					bonusData.expiresIn,
				);
			});
		});

		this.addExpiringBonus(player, "money", "Test Money Bonus", 15, 5);
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

	addExpiringBonus(
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

		const existingBonus = sharedAtoms.bonuses()[userId]?.find((bonusData) => bonusData.bonusName === bonusName);
		if (existingBonus !== undefined) {
			if (!isExpiringBonusData(existingBonus)) {
				return;
			}

			expiresIn += existingBonus.expiresIn - (os.time() - existingBonus.startTime);
		}

		this.storeService
			.updateValue(player, "expiringBonuses", (expiringBonuses) => {
				expiringBonuses.remove(expiringBonuses.findIndex((bonusData) => bonusData.bonusName === bonusName));
				expiringBonuses.push({
					valueName,
					bonusName,
					percent,
					startTime: os.time(),
					expiresIn,
					icon,
					displayName,
					description,
				});

				return expiringBonuses;
			})
			.then(() => {
				if (this.checkIntervalCleanups[userId] === undefined) {
					this.initCheckInterval(player);
				}
			});
	}

	setActiveBonus(
		player: Player,
		valueName: string,
		bonusName: string,
		percent: number,
		icon?: string,
		displayName?: string,
		description?: string,
		startTime?: number,
		expiresIn?: number,
	): void {
		const userId = tostring(player.UserId);

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
				startTime,
				expiresIn,
			});

			return { ...state, [userId]: userState };
		});
	}

	removeActiveBonus(player: Player, bonusName: string): void {
		const userId = tostring(player.UserId);

		sharedAtoms.bonuses((state) => {
			const userState = state[userId] ? [...state[userId]] : [];
			userState.remove(userState.findIndex((bonusData) => bonusData.bonusName === bonusName));
			return { ...state, [userId]: [...userState] };
		});
	}

	getActiveBonus(player: Player, bonusName: string): BonusData | undefined {
		const userId = tostring(player.UserId);
		return sharedAtoms.bonuses()[userId]?.find((bonusData) => bonusData.bonusName === bonusName);
	}

	hasActiveBonus(player: Player, bonusName: string): boolean {
		return this.getActiveBonus(player, bonusName) !== undefined;
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
			this.storeService.getValue(player, "expiringBonuses").then((expiringBonuses) => {
				if (expiringBonuses === undefined) {
					return;
				}

				if (expiringBonuses.size() <= 0) {
					return;
				}

				const expiredBonusesNames = expiringBonuses
					.filter(
						(bonusData) =>
							isExpiringBonusData(bonusData) && os.time() - bonusData.startTime >= bonusData.expiresIn,
					)
					.map((bonusData) => bonusData.bonusName);

				if (expiredBonusesNames.size() > 0) {
					this.storeService.updateValue(player, "expiringBonuses", (data) => {
						expiredBonusesNames.forEach((bonusName) =>
							data.remove(data.findIndex((bonusData) => bonusData.bonusName === bonusName)),
						);

						return data;
					});
				}
			});
		}, 5);
	}

	private clearCheckInterval(player: Player) {
		const userId = tostring(player.UserId);

		this.checkIntervalCleanups[userId]?.();
		this.checkIntervalCleanups[userId] = undefined;
	}
}
