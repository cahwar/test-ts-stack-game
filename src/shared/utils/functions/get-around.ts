import { Workspace } from "@rbxts/services";
import { getFirstParent } from "./get-first";

function filter<T extends Instance>(overlapParts: BasePart[], predicate: (instance: Instance) => boolean): T[] {
	const instances: Array<T> = [];

	overlapParts.forEach((part) => {
		const instance = predicate(part) ? part : getFirstParent(part, predicate);

		if (instance && !instances.includes(instance as T)) instances.push(instance as T);
	});

	return instances;
}

export function getAround<T extends Instance>(
	origin: Vector3,
	radius: number,
	predicate: (instance: Instance) => boolean,
	exclude?: Instance[],
): T[] {
	const params = new OverlapParams();
	params.FilterDescendantsInstances = exclude ?? [];
	params.FilterType = Enum.RaycastFilterType.Exclude;

	const overlapParts = Workspace.GetPartBoundsInRadius(origin, radius, params);

	return filter<T>(overlapParts, predicate);
}

export function getAroundIncluded<T extends Instance>(
	include: Instance[],
	origin: Vector3,
	radius: number,
	predicate: (instance: Instance) => boolean,
): T[] {
	const params = new OverlapParams();
	params.FilterDescendantsInstances = include;
	params.FilterType = Enum.RaycastFilterType.Include;

	const overlapParts = Workspace.GetPartBoundsInRadius(origin, radius, params);

	return filter<T>(overlapParts, predicate);
}
