import { Controller, OnStart } from "@flamework/core";
import { OnCharacterAdded, OnCharacterRemoved } from "./character-lifecycle.controller";
import { Trove } from "@rbxts/trove";
import { Players, RunService } from "@rbxts/services";
import { atom, subscribe } from "@rbxts/charm";
import { FovController, FovInfo } from "./fov.controller";
import { enableParticles } from "shared/utils/vfx-utils";
import { getVfx } from "shared/utils/asset-utils";

const TIME_TO_ENABLE_EFFECT = 1;
const FOV_INFO: FovInfo = {
	fov: FovController.getDefaultFov() + 15,
	tweenInfo: new TweenInfo(0.6, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
	priority: 1,
};

@Controller()
export class RunEffectController implements OnStart, OnCharacterAdded, OnCharacterRemoved {
	private lifecycleTrove: Trove = new Trove();
	private effectTrove: Trove = new Trove();
	private runStartedTick: number | undefined = undefined;
	private isEffectActive = atom(false);

	constructor(private readonly fovController: FovController) {}

	onStart(): void {
		subscribe(this.isEffectActive, (isActive: boolean) => {
			if (isActive) this.activateEffect();
			else this.deactivateEffect();
		});
	}

	onCharacterAdded(character: Model): void {
		const humanoid = character.WaitForChild("Humanoid") as Humanoid;

		this.lifecycleTrove.add(() => this.deactivateEffect());

		this.lifecycleTrove.connect(RunService.Heartbeat, () => {
			const moveMagnitude = humanoid.MoveDirection.Magnitude;

			if (moveMagnitude >= 0.1) {
				if (this.runStartedTick === undefined) this.runStartedTick = tick();
				else if (!this.isEffectActive() && tick() - this.runStartedTick >= TIME_TO_ENABLE_EFFECT)
					this.isEffectActive(true);
			} else {
				if (this.runStartedTick !== undefined) this.runStartedTick = undefined;
				if (this.isEffectActive()) this.isEffectActive(false);
			}
		});
	}

	onCharacterRemoved(): void {
		this.lifecycleTrove.destroy();
	}

	private activateEffect() {
		this.deactivateEffect();

		this.fovController.addFov("run", FOV_INFO);
		this.effectTrove.add(() => this.fovController.removeFov("run"));

		const character = Players.LocalPlayer.Character as Model;

		["RightFoot", "LeftFoot"].forEach((partName: string) => {
			const part = character.FindFirstChild(partName) as BasePart | undefined;
			if (part !== undefined) {
				const { cleanup, enabled } = enableParticles(getVfx("StepParticle"), part);

				this.effectTrove.add(() => cleanup());
				this.effectTrove.connect(RunService.Heartbeat, () => {
					const humanoid = character.FindFirstChildWhichIsA("Humanoid") as Humanoid | undefined;
					if (humanoid === undefined) return;

					const state = humanoid.GetState();

					enabled(state === Enum.HumanoidStateType.Running || state === Enum.HumanoidStateType.Landed);
				});
			}
		});
	}

	private deactivateEffect() {
		this.effectTrove.destroy();
	}
}
