import { Controller, OnStart } from "@flamework/core";
import { atom } from "@rbxts/charm";
import { createMotion } from "@rbxts/ripple";
import { Players, Workspace } from "@rbxts/services";
import { setTimeout } from "@rbxts/set-timeout";
import { Events } from "client/network";
import { springs } from "shared/constants/ui/springs";
import { getSound } from "shared/utils/asset-utils";
import { getBezier } from "shared/utils/functions/get-bezier";
import { getPositiveOrNegative } from "shared/utils/functions/get-positive-or-negative";
import { getUniqueId } from "shared/utils/functions/get-unique-id";
import { playSound } from "shared/utils/sfx-utils";

const MAGNET_DELAY = 0.35;
const SPAWN_SOUND = getSound("MagnetableSpawn");
const DING_SOUND = getSound("MagnetableDing");
const POP_SOUND = getSound("MagnetablePop");

export interface MagnetableData {
	visible: boolean;
	adornee: BasePart;
	icon: string;
	id: string;
}

@Controller()
export class MagnetableController implements OnStart {
	private magnetables = atom<MagnetableData[]>([]);

	onStart(): void {
		Events.EmitMagnetable.connect((origin, icon, amount, radius) => {
			this.emit(origin, icon, amount, radius);
		});
	}

	emit(origin: Vector3, icon: string, amount: number, radius: number): void {
		for (let i = 0; i <= amount; i++) {
			const magnetable = this.create(origin, icon);

			const landPoint = origin.add(
				new Vector3(
					math.random(radius) * getPositiveOrNegative(),
					0,
					math.random(radius) * getPositiveOrNegative(),
				),
			);

			const magnetMotion = createMotion(landPoint);
			magnetMotion.onStep((position) => (magnetable.adornee.Position = position));
			magnetMotion.onComplete(() => {
				magnetMotion.destroy();

				this.remove(magnetable.id);
			});

			const alphaMotion = createMotion(0, { start: true });
			alphaMotion.onStep((value) => (magnetable.adornee.Position = getBezier(origin, landPoint, value)));
			alphaMotion.onComplete(() => {
				alphaMotion.destroy();

				setTimeout(() => {
					this.hide(magnetable.id);

					if (i === 1) {
						playSound(SPAWN_SOUND);
						setTimeout(() => playSound(DING_SOUND), 0.1);
					}

					magnetMotion.spring(
						Players.LocalPlayer.Character?.PrimaryPart?.Position ?? landPoint,
						springs.responsive,
					);
					magnetMotion.start();
				}, MAGNET_DELAY);
			});
			alphaMotion.spring(1, springs.responsive);

			if (i === 1) {
				playSound(SPAWN_SOUND);
				setTimeout(() => playSound(POP_SOUND), 0.1);
			}
		}
	}

	get(): MagnetableData[] {
		return this.magnetables();
	}

	private create(position: Vector3, icon: string): MagnetableData {
		const part = new Instance("Part");
		part.Transparency = 1;
		part.CanCollide = false;
		part.Anchored = true;
		part.Size = Vector3.one;
		part.Position = position;
		part.Parent = Workspace;

		const magnetable = { visible: true, id: getUniqueId(), adornee: part, icon };

		this.magnetables((prev) => [...prev, magnetable]);

		return magnetable;
	}

	private hide(id: string): void {
		this.magnetables((prev) => [
			...prev.map((data) => {
				if (data.id !== id) return data;
				return { ...data, visible: false };
			}),
		]);
	}

	private remove(id: string): void {
		this.magnetables()
			.find((value) => value.id === id)
			?.adornee?.Destroy();
		this.magnetables((prev) => [...prev.filter((data) => data.id !== id)]);
	}
}
