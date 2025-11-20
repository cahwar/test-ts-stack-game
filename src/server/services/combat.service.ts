import { Service } from "@flamework/core";
import { OnClick } from "./clicker.service";
import { isPlayerAlive } from "shared/utils/player-utils";
import { getAroundIncluded } from "shared/utils/functions/get-around";
import { Events } from "server/network";
import { WeaponService } from "./weapon.service";
import { StoreService } from "./store.service";
import { CollectionService } from "@rbxts/services";
import { NpcService } from "./npc.service";

const CRITICAL_MULTIPLER = 1.5;
const CRITICAL_CHANCE = 10;

@Service()
export class CombatService implements OnClick {
	constructor(
		private readonly weaponService: WeaponService,
		private readonly storeService: StoreService,
		private readonly npcService: NpcService,
	) {}

	onClick(player: Player): void {
		if (!isPlayerAlive(player)) return;

		const weaponConfig = this.weaponService.getEquippedConfig(player);
		if (weaponConfig === undefined) return;

		const damage = this.storeService.getValue(player, "power").expect();
		if (damage === undefined) return;

		const character = player.Character as Model;

		const targets = getAroundIncluded<Model>(
			CollectionService.GetTagged("TargetHitPart"),
			(character.PrimaryPart as BasePart).Position,
			weaponConfig.radius,
			(instance: Instance) => {
				const humanoid = instance.FindFirstChildWhichIsA("Humanoid");
				return (
					instance.HasTag("Target") &&
					humanoid !== undefined &&
					humanoid.GetState() !== Enum.HumanoidStateType.Dead
				);
			},
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

			const { success, killed } = this.damage(target, damage * (isCritical ? CRITICAL_MULTIPLER : 1), isCritical);

			if (success) {
				Events.Combat.Targeted.fire(player, target);

				if (killed && this.npcService.isNpc(target)) {
					this.npcService.countKill(player, target);
				}
			}

			count += 1;
		});
	}

	private damage(target: Model, damage: number, isCritical: boolean): { success: boolean; killed?: boolean } {
		const humanoid = target.FindFirstChildWhichIsA("Humanoid");
		if (!humanoid || humanoid.GetState() === Enum.HumanoidStateType.Dead) return { success: false };

		const healthBefore = humanoid.Health;

		humanoid.TakeDamage(damage);

		Events.Combat.Damaged.broadcast(target, damage, isCritical);

		return { success: true, killed: healthBefore > 0 && humanoid.Health <= 0 };
	}
}
