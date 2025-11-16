import { createMotion } from "@rbxts/ripple";
import { CollectionService, RunService, Workspace } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import { RAYCAST_IGNORE_TAGS } from "shared/constants/ignore-tags";
import { springs } from "shared/constants/ui/springs";
import { getReplicatedAsset } from "shared/utils/asset-utils";

const INSTANCE = getReplicatedAsset("TargetRing") as BasePart;
const INSTANCE_SIZE = INSTANCE.Size;
const RING_SIZE_MULTIPLER = 1.56;

export class TargetRing {
	private scaleMotion = createMotion(0, { start: true });
	private readonly trove = new Trove();
	private removeCalled = false;

	private readonly targetSize: Vector3;
	private readonly floorDistance: number;
	private readonly instance: BasePart;
	private readonly size: Vector3;

	constructor(private readonly target: Model) {
		this.targetSize = this.target.GetExtentsSize();
		this.floorDistance = this.getFloorDistance();

		const dominantAxis = math.max(this.targetSize.X, this.targetSize.Y, this.targetSize.Z);
		const diameterSize = Vector3.one.mul(dominantAxis).mul(RING_SIZE_MULTIPLER);
		this.size = new Vector3(diameterSize.X, INSTANCE_SIZE.Y, diameterSize.Z);

		this.instance = INSTANCE.Clone();
		this.instance.Parent = Workspace;

		this.scaleMotion.onStep((value) => {
			this.instance.Size = Vector3.zero.Lerp(this.size, value);
		});

		this.update();
		this.appear();

		this.trove.add(() => {
			this.scaleMotion.destroy();
		});

		this.trove.add(this.instance);

		this.trove.connect(RunService.RenderStepped, () => {
			this.update();
		});
	}

	update(): void {
		const targetCFrame = this.target.GetPivot();

		const currentCFrame = this.instance.CFrame;
		const [xRot, yRot, zRot] = currentCFrame.ToEulerAnglesYXZ();

		const cFrameToSet = new CFrame(
			targetCFrame.Position.X,
			targetCFrame.Position.Y - this.floorDistance,
			targetCFrame.Position.Z,
		).mul(CFrame.Angles(xRot, yRot + math.rad(1), zRot));

		this.instance.CFrame = cFrameToSet;
	}

	appear(): void {
		this.scaleMotion.spring(1, springs.responsive);
	}

	remove(): void {
		if (this.removeCalled === true) return;
		this.removeCalled = true;

		this.scaleMotion.onComplete(() => this.clear());
		this.scaleMotion.spring(0, springs.responsive);
	}

	private clear(): void {
		this.trove.destroy();
	}

	private getFloorDistance(): number {
		const exclude: Instance[] = [this.target];

		RAYCAST_IGNORE_TAGS.forEach((tag) =>
			CollectionService.GetTagged(tag).forEach((instance) => exclude.push(instance)),
		);

		const params = new RaycastParams();
		params.FilterDescendantsInstances = exclude;
		params.FilterType = Enum.RaycastFilterType.Exclude;

		const targetCFrame = this.target.GetPivot();

		let floorDistance = targetCFrame.Position.Y - (targetCFrame.Position.Y - this.targetSize.Y / 2);

		const raycastResult = Workspace.Raycast(targetCFrame.Position, new Vector3(0, -10, 0), params);
		if (raycastResult && raycastResult.Instance !== undefined)
			floorDistance = targetCFrame.Position.Y - raycastResult.Position.Y;

		return floorDistance;
	}
}
