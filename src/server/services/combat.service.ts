import { Service } from "@flamework/core";
import { OnClick } from "./clicker.service";
import { isPlayerAlive } from "shared/utils/player-utils";
import { getAround } from "shared/utils/functions/get-around";
import { Events } from "server/network";
import { WeaponService } from "./weapon.service";
import { StoreService } from "./store.service";

const CRITICAL_MULTIPLER = 1.5;
const CRITICAL_CHANCE = 10;

@Service()
export class CombatService implements OnClick {
	constructor(
		private readonly weaponService: WeaponService,
		private readonly storeService: StoreService,
	) {}

	onClick(player: Player): void {
		if (!isPlayerAlive(player)) return;

		const character = player.Character as Model;
		const targets = getAround(
			character.PrimaryPart!.Position,
			this.getRadius(player),
			(instance: Instance) => instance.HasTag("Target"),
			[character],
		);

		const damage = this.getDamage(player);

		targets.sort(
			(a, b) =>
				player.DistanceFromCharacter((a as Model).GetPivot().Position) <
				player.DistanceFromCharacter((b as Model).GetPivot().Position),
		);

		let count = 0;

		targets.forEach((target) => {
			if (count >= this.getSplashHits(player)) return;

			const isCritical = math.random(1, 100) < CRITICAL_CHANCE;
			this.damage(target as Model, damage * (isCritical ? CRITICAL_MULTIPLER : 1), isCritical);

			count += 1;
		});
	}

	private damage(target: Model, damage: number, isCritical: boolean) {
		const humanoid = target.FindFirstChildWhichIsA("Humanoid");
		if (!humanoid || humanoid.GetState() === Enum.HumanoidStateType.Dead) return;

		humanoid.TakeDamage(damage);

		Events.Combat.Damaged.broadcast(target, damage, isCritical);
	}

	private getDamage(player: Player): number {
		return this.storeService.getValue(player, "power").expect();
	}

	private getRadius(player: Player): number {
		return this.weaponService.getEquippedConfig(player)?.radius ?? 10;
	}

	private getSplashHits(player: Player): number {
		return this.weaponService.getEquippedConfig(player)?.splashHits ?? 1;
	}
}
