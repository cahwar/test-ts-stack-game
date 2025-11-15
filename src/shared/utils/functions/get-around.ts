import { Workspace } from "@rbxts/services";
import { getFirstParent } from "./get-first";

export function getAround(
	position: Vector3,
	radius: number,
	predicate: (instance: Instance) => boolean,
	ignore?: Instance[],
) {
	const params = new OverlapParams();
	params.FilterDescendantsInstances = ignore ?? [];
	params.FilterType = Enum.RaycastFilterType.Exclude;

	const instances: Array<Instance> = [];

	const overlapParts = Workspace.GetPartBoundsInRadius(position, radius, params);

	overlapParts.forEach((part) => {
		const instance = predicate(part) ? part : getFirstParent(part, predicate);

		if (instance && !instances.includes(instance)) instances.push(instance);
	});

	return instances;
}
