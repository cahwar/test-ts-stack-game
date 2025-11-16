import { Controller, OnRender, OnStart } from "@flamework/core";
import { atom, observe, peek } from "@rbxts/charm";
import { OnCharacterRemoved } from "../character-lifecycle.controller";
import { Events } from "client/network";
import { isPlayerAlive } from "shared/utils/player-utils";
import { Players } from "@rbxts/services";
import { isCharacterAlive } from "shared/utils/character-utils";
import { TargetRing } from "./target-ring";

const REMOVAL_RADIUS = 15;
const UPDATE_FREQUENCY = 0.3;

interface TargetData {
	meetPosition: Vector3;
	instance: Model;
	name: string;
}

@Controller()
export class TargetController implements OnStart, OnRender, OnCharacterRemoved {
	private targets = atom<Map<Model, TargetData | undefined>>(new Map());
	private latestUpdateTime = 0;

	onStart(): void {
		Events.Combat.Damaged.connect((target) => this.add(target));

		observe(this.targets, (target) => {
			const ring = new TargetRing(target!.instance);

			return function () {
				ring.remove();
			};
		});
	}

	onCharacterRemoved(): void {
		this.clear();
	}

	onRender(): void {
		if (tick() - this.latestUpdateTime < UPDATE_FREQUENCY) return;

		this.latestUpdateTime = tick();

		if (!isPlayerAlive()) return;

		const characterPosition = Players.LocalPlayer.Character!.PrimaryPart!.Position;

		for (const [, v] of pairs(peek(this.targets()))) {
			if (!isCharacterAlive(v.instance) || characterPosition.sub(v.meetPosition).Magnitude >= REMOVAL_RADIUS)
				this.remove(v.instance);
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
}
