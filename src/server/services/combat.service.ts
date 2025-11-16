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

		const weaponConfig = this.weaponService.getEquippedConfig(player);
		const damage = this.storeService.getValue(player, "power").expect();

		const character = player.Character as Model;
		const targets = getAround<Model>(
			character.PrimaryPart!.Position,
			weaponConfig.radius,
			(instance: Instance) => instance.HasTag("Target"),
			[character],
		);

		targets.sort(
			(a, b) =>
				player.DistanceFromCharacter(a.GetPivot().Position) <
				player.DistanceFromCharacter(b.GetPivot().Position),
		);

		let count = 0;

		targets.forEach((target) => {
			if (count >= weaponConfig.splashHits) return;

			const isCritical = math.random(1, 100) < CRITICAL_CHANCE;
			this.damage(target, damage * (isCritical ? CRITICAL_MULTIPLER : 1), isCritical);

			count += 1;
		});
	}

	private damage(target: Model, damage: number, isCritical: boolean) {
		const humanoid = target.FindFirstChildWhichIsA("Humanoid");
		if (!humanoid || humanoid.GetState() === Enum.HumanoidStateType.Dead) return;

		humanoid.TakeDamage(damage);

		Events.Combat.Damaged.broadcast(target, damage, isCritical);
	}
}
