import { Controller } from "@flamework/core";
import { OnCharacterAdded, OnCharacterRemoved } from "./character-lifecycle.controller";
import { Trove } from "@rbxts/trove";
import { Players, UserInputService } from "@rbxts/services";
import { getAnimation, getSound, getVfx } from "shared/utils/asset-utils";
import { emitParticles } from "shared/utils/vfx-utils";
import { playSound } from "shared/utils/sfx-utils";
import { playAnimation } from "shared/utils/animation-utils";

const EXTRA_JUMPS = 1;
const JUMPS_GAP = 0.2;

const JUMP_ANIMATION = getAnimation("Backflip");
const JUMP_SOUND = getSound("Jump");
const JUMP_VFX = getVfx("Jump");

const VFX_PARTS = ["RightFoot", "LeftFoot"];

@Controller()
export class MultipleJumpController implements OnCharacterAdded, OnCharacterRemoved {
	private controlsTrove = new Trove();
	private latestJumpTick = 0;
	private count = 0;

	onCharacterAdded(character: Model): void {
		const humanoid = character.FindFirstChildWhichIsA("Humanoid") as Humanoid;

		this.controlsTrove.add(() => {
			this.count = 0;
		});

		this.controlsTrove.connect(UserInputService.JumpRequest, () => {
			if (!humanoid.IsDescendantOf(game) || humanoid.GetState() === Enum.HumanoidStateType.Dead) return;
			if (humanoid.GetState() !== Enum.HumanoidStateType.Freefall || this.count >= EXTRA_JUMPS) return;
			if (tick() - this.latestJumpTick < JUMPS_GAP) return;

			this.processJump();
		});

		this.controlsTrove.connect(humanoid.StateChanged, (prev, newValue: Enum.HumanoidStateType) => {
			if (newValue === Enum.HumanoidStateType.Jumping) this.latestJumpTick = tick();
			else if (newValue === Enum.HumanoidStateType.Landed) this.count = 0;
		});
	}

	onCharacterRemoved(): void {
		this.controlsTrove.destroy();
	}

	private processJump() {
		const character = Players.LocalPlayer.Character as Model;
		const humanoid = character.FindFirstChildWhichIsA("Humanoid") as Humanoid;

		this.count += 1;

		humanoid.ChangeState(Enum.HumanoidStateType.Jumping);

		this.playEffect();
	}

	private playEffect() {
		const character = Players.LocalPlayer.Character as Model;

		playAnimation(character, JUMP_ANIMATION);
		playSound(JUMP_SOUND);

		VFX_PARTS.forEach((partName) => {
			const part = character.FindFirstChild(partName);
			if (part) emitParticles(JUMP_VFX, part as BasePart, math.random(1, 2));
		});
	}
}
