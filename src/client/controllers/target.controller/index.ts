import { Controller, OnRender, OnStart } from "@flamework/core";
import { atom, observe, peek, subscribe } from "@rbxts/charm";
import { OnCharacterRemoved } from "../character-lifecycle.controller";
import { Events } from "client/network";
import { isPlayerAlive } from "shared/utils/player-utils";
import { Players } from "@rbxts/services";
import { isCharacterAlive } from "shared/utils/character-utils";
import { TargetRing } from "./target-ring";
import Object from "@rbxts/object-utils";

const REMOVAL_RADIUS = 15;
const TARGETS_UPDATE_COOLDOWN = 0.3;

interface TargetData {
	meetPosition: Vector3;
	instance: Model;
	name: string;
}

@Controller()
export class TargetController implements OnStart, OnRender, OnCharacterRemoved {
	private targets = atom<Map<Model, TargetData | undefined>>(new Map());
	private latestTargetsUpdateTime = 0;
	private facePosition: Vector3 | undefined = undefined;

	onStart(): void {
		Events.Combat.Targeted.connect((target) => {
			if (target === undefined) return;

			if (isPlayerAlive()) this.add(target);
		});

		observe(this.targets, (target) => {
			const ring = new TargetRing(target!.instance);

			return function () {
				ring.remove();
			};
		});

		subscribe(this.targets, (state) => {
			if (state.isEmpty()) {
				this.facePosition = undefined;

				if (isPlayerAlive()) {
					const character = Players.LocalPlayer.Character as Model;
					const humanoid = character.FindFirstChildWhichIsA("Humanoid") as Humanoid;

					humanoid.AutoRotate = true;
				}
			} else {
				const entries = Object.entries(state);
				this.facePosition = entries[entries.size() - 1][1].instance.GetPivot().Position;
			}
		});
	}

	onCharacterRemoved(): void {
		this.clear();
	}

	onRender(): void {
		if (!isPlayerAlive()) return;
		if (tick() - this.latestTargetsUpdateTime >= TARGETS_UPDATE_COOLDOWN) this.updateTargets();
		if (this.facePosition !== undefined) {
			this.forceFaceTarget(this.facePosition as Vector3);
		}
	}

	private add(target: Model) {
		if (this.targets().has(target)) return;

		const meetPosition = Players.LocalPlayer.Character!.PrimaryPart!.Position;
		this.targets((prev) => new Map([...prev, [target, { meetPosition, instance: target, name: target.Name }]]));
	}

	private remove(target: Model) {
		this.targets((prev) => new Map([...prev, [target, undefined]]));
	}

	private clear() {
		this.targets(new Map());
	}

	private updateTargets() {
		const characterPosition = Players.LocalPlayer.Character!.PrimaryPart!.Position;

		for (const [, v] of pairs(peek(this.targets()))) {
			if (!isCharacterAlive(v.instance) || characterPosition.sub(v.meetPosition).Magnitude >= REMOVAL_RADIUS)
				this.remove(v.instance);
		}

		this.latestTargetsUpdateTime = tick();
	}

	private forceFaceTarget(facePosition: Vector3) {
		const character = Players.LocalPlayer.Character as Model;
		const humanoid = character.FindFirstChildWhichIsA("Humanoid") as Humanoid;

		humanoid.AutoRotate = false;

		const cFrame = character.PrimaryPart!.CFrame;

		character.PivotTo(
			CFrame.lookAt(cFrame.Position, new Vector3(facePosition.X, cFrame.Position.Y, facePosition.Z)),
		);
	}
}
