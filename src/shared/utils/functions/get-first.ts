import { Workspace } from "@rbxts/services";

export function getFirstParent<T extends Instance>(
	instance: Instance,
	predicate: (parent: Instance) => boolean,
): T | undefined {
	let parent = instance.Parent as Instance;

	while (parent !== undefined && parent !== Workspace && !predicate(parent)) {
		parent = parent.Parent as Instance;
		task.wait();
	}

	return parent === undefined || parent === Workspace ? undefined : (parent as T);
}
