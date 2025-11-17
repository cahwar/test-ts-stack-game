import { Controller, OnStart } from "@flamework/core";
import { atom, observe } from "@rbxts/charm";
import { createMotion } from "@rbxts/ripple";
import { CollectionService, Debris, Players, TweenService, Workspace } from "@rbxts/services";
import { Events } from "client/network";
import { RAYCAST_IGNORE_TAGS } from "shared/constants/ignore-tags";
import { springs } from "shared/constants/ui/springs";
import { getSound, getVfx } from "shared/utils/asset-utils";
import { playSound } from "shared/utils/sfx-utils";
import { emitParticles } from "shared/utils/vfx-utils";

const MAX_EFFECT_DISTANCE = 150;
const DESTROY_VFX = getVfx("NpcDestroyPuff");
const SPAWNED_SOUND = getSound("NpcBorn");

@Controller()
export class NpcController implements OnStart {
	private npcs = atom<Model[]>([]);

	onStart(): void {
		CollectionService.GetTagged("Npc").forEach((npc) => this.add(npc as Model));
		CollectionService.GetInstanceAddedSignal("Npc").Connect((npc) => this.add(npc as Model));
		CollectionService.GetInstanceRemovedSignal("Npc").Connect((npc) => this.remove(npc as Model));

		observe(this.npcs, (npc) => {
			if (this.shouldPlayEffect(npc)) {
				this.playSpawnedEffect(npc);
			}
		});

		Events.Npc.Killed.connect((npc, effectTime) => {
			if (npc === undefined) return;

			if (this.shouldPlayEffect(npc)) {
				this.playKilledEffect(npc, effectTime);
			}
		});
	}

	private add(npc: Model) {
		this.npcs((prev) => [...prev, npc]);
	}

	private remove(npc: Model) {
		this.npcs((prev) => {
			const index = prev.indexOf(npc);

			if (index !== undefined) {
				prev.remove(index);
			}

			return [...prev];
		});
	}

	private shouldPlayEffect(npc: Model): boolean {
		return (
			Players.LocalPlayer.Character !== undefined &&
			Players.LocalPlayer.DistanceFromCharacter(npc.GetPivot().Position) <= MAX_EFFECT_DISTANCE
		);
	}

	private playSpawnedEffect(npc: Model) {
		const spawnedTick = tick();

		while (!npc.PrimaryPart && npc.IsDescendantOf(game) && tick() - spawnedTick < 1.5) {
			task.wait();
		}

		if (!npc.IsDescendantOf(game) || !npc.PrimaryPart) return;

		const cFrame = npc.GetPivot();
		const [xRot, yRot, zRot] = cFrame.ToEulerAnglesYXZ();
		let position = cFrame.Position;

		const exclude: Instance[] = [];
		RAYCAST_IGNORE_TAGS.forEach((tag) =>
			CollectionService.GetTagged(tag).forEach((instance) => exclude.push(instance)),
		);

		const params = new RaycastParams();
		params.FilterDescendantsInstances = exclude;
		params.FilterType = Enum.RaycastFilterType.Exclude;

		const raycastResult = Workspace.Raycast(position, cFrame.UpVector.mul(-10), params);
		if (raycastResult && raycastResult.Instance) {
			position = new Vector3(position.X, raycastResult.Position.Y + npc.GetExtentsSize().Y / 1.6, position.Z);
		}

		const originCFrame = new CFrame(position).mul(CFrame.Angles(xRot, yRot, zRot));
		const undergroundCFrame = originCFrame.mul(new CFrame(0, -10, 0));

		const motion = createMotion(0, { start: true });

		playSound(SPAWNED_SOUND, npc.PrimaryPart);

		motion.onStep((value) => npc.PivotTo(undergroundCFrame.Lerp(originCFrame, value)));
		motion.immediate(0);

		motion.onComplete(() => {
			motion.destroy();
		});

		motion.spring(1, springs.responsive);
		motion.start();
	}

	private playKilledEffect(npc: Model, effectTime: number) {
		const easing = new TweenInfo(effectTime, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);

		npc.GetDescendants().forEach((value: Instance) => {
			if (!value.IsA("BasePart") && !value.IsA("Decal")) {
				return;
			}

			TweenService.Create(value, easing, { Transparency: 1 }).Play();

			if (value.IsA("BasePart")) {
				const clone = new Instance("Part");
				clone.Size = value.Size;
				clone.CFrame = value.CFrame;
				clone.Anchored = true;
				clone.CanCollide = false;
				clone.CanQuery = false;
				clone.Transparency = 1;
				clone.Parent = Workspace;

				emitParticles(DESTROY_VFX, clone, 8);

				Debris.AddItem(clone, (DESTROY_VFX as ParticleEmitter).Lifetime.Max);
			}
		});
	}
}
