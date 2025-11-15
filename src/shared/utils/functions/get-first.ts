import { Workspace } from "@rbxts/services";

export function getFirstParent(instance: Instance, predicate: (parent: Instance) => boolean): Instance | undefined {
	let parent = instance.Parent as Instance;

	while (!predicate(parent) && parent !== Workspace) {
		parent = parent.Parent as Instance;
		task.wait();
	}

	return parent === Workspace ? undefined : parent;
}
