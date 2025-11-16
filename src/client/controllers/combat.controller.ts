import { Controller } from "@flamework/core";
import { OnCharacterAdded } from "./character-lifecycle.controller";
import { OnClick } from "./clicker.controller";
import { getAnimation, getSound } from "shared/utils/asset-utils";
import { loadAnimation, playAnimation, stopAnimation } from "shared/utils/animation-utils";
import { Players } from "@rbxts/services";
import { playSound } from "shared/utils/sfx-utils";
import { setTimeout } from "@rbxts/set-timeout";
import { isPlayerAlive } from "shared/utils/player-utils";

const IDLE_ANIMATION = getAnimation("ShoulderIdle");
const ATTACK_ANIMATIONS = [getAnimation("Attack1"), getAnimation("Attack2"), getAnimation("Attack3")];
const ATTACK_SOUNDS = [getSound("SoftSwing"), getSound("SwordSwing")];

@Controller()
export class CombatController implements OnCharacterAdded, OnClick {
	private animationIndex = 0;
	private soundIndex = 0;

	onCharacterAdded(character: Model): void {
		ATTACK_ANIMATIONS.forEach((animation) => loadAnimation(character, animation));

		setTimeout(() => {
			playAnimation(character, IDLE_ANIMATION);
		}, 2);
	}

	onClick(): void {
		this.attack();
	}

	private attack() {
		if (!isPlayerAlive()) return;

		const character = Players.LocalPlayer.Character as Model;

		stopAnimation(character, ATTACK_ANIMATIONS[this.animationIndex].Name);

		this.animationIndex = this.animationIndex + 1 > ATTACK_ANIMATIONS.size() - 1 ? 0 : this.animationIndex + 1;
		this.soundIndex = this.soundIndex + 1 > ATTACK_SOUNDS.size() - 1 ? 0 : this.soundIndex + 1;

		playAnimation(character, ATTACK_ANIMATIONS[this.animationIndex]);
		playSound(ATTACK_SOUNDS[this.soundIndex]);
	}
}
