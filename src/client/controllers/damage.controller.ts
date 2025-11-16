import { Controller, OnStart } from "@flamework/core";
import { getSound, getVfx } from "shared/utils/asset-utils";
import { FloaterController } from "./floater-controller";
import { Events } from "client/network";
import { DAMAGE_ICON } from "shared/constants/ui/icons";
import { CRIT_DAMAGE_COLOR, DAMAGE_COLOR } from "shared/constants/ui/palette";
import { playSound } from "shared/utils/sfx-utils";
import { getColoredString, getRoundedNumberString } from "shared/utils/text-utils";
import { emitParticlesFromAttributes, flashHighlight } from "shared/utils/vfx-utils";

const CRIT_SOUND = getSound("CriticalHit");
const HIT_SOUNDS = [getSound("MeleeHit1"), getSound("MeleeHit2"), getSound("MeleeHit3")];

@Controller()
export class DamageController implements OnStart {
	constructor(private readonly floaterController: FloaterController) {}

	onStart(): void {
		Events.Combat.Damaged.connect((target, damage, isCritical) => {
			this.playDamagedEffect(target, damage, isCritical);
		});
	}

	private playDamagedEffect(target: Model, damage: number, isCritical: boolean) {
		const primaryPart: BasePart =
			(target.PrimaryPart as BasePart) ?? (target.FindFirstChildWhichIsA("BasePart", true) as BasePart);

		emitParticlesFromAttributes(getVfx("Damage"), primaryPart);
		flashHighlight(target, "DamageHighlight", 0.15, Color3.fromRGB(0, 0, 0), Color3.fromRGB(255, 70, 73), 0.5, 0.5);
		playSound(HIT_SOUNDS[math.random(HIT_SOUNDS.size() - 1)], primaryPart);

		this.floaterController.add(
			getColoredString(`-${getRoundedNumberString(damage, 2)}`, isCritical ? CRIT_DAMAGE_COLOR : DAMAGE_COLOR),
			DAMAGE_ICON,
			primaryPart,
			0.5,
		);

		if (isCritical) {
			this.floaterController.add(getColoredString("CRIT!", CRIT_DAMAGE_COLOR), "", primaryPart, 0.6);
			playSound(CRIT_SOUND, primaryPart);
		}
	}
}
