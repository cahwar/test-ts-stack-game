import { Workspace } from "@rbxts/services";
import { getFirstParent } from "./get-first";

export function getAround<T extends Instance>(
	predicate: (instance: Instance) => boolean,
	position: Vector3,
	radius: number,
	ignore?: Instance[],
): T[] {
	const params = new OverlapParams();
	params.FilterDescendantsInstances = ignore ?? [];
	params.FilterType = Enum.RaycastFilterType.Exclude;

	const instances: Array<T> = [];

	const overlapParts = Workspace.GetPartBoundsInRadius(position, radius, params);

	overlapParts.forEach((part) => {
		const instance = predicate(part) ? part : getFirstParent(part, predicate);

		if (instance && !instances.includes(instance as T)) instances.push(instance as T);
	});

	return instances;
}
