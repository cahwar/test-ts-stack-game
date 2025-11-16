import { OnStart, Service } from "@flamework/core";
import { CollectionService, PhysicsService } from "@rbxts/services";

interface CollisionGroup {
	name: string;
	tag: string;
	relationships: { [K in string]: boolean };
}

const GROUPS: CollisionGroup[] = [
	{ name: "PlayerCharacter", tag: "PlayerCharacter", relationships: { Npc: false, PlayerCharacter: false } },
	{ name: "Npc", tag: "Npc", relationships: { Npc: false, PlayerCharacter: false } },
];

@Service()
export class CollisionService implements OnStart {
	onStart(): void {
		GROUPS.forEach((group) => PhysicsService.RegisterCollisionGroup(group.name));
		GROUPS.forEach((group) => {
			CollectionService.GetTagged(group.tag).forEach((instance) => this.apply(instance, group.name));
			CollectionService.GetInstanceAddedSignal(group.tag).Connect((instance) => this.apply(instance, group.name));

			for (const [name, statement] of pairs(group.relationships)) {
				PhysicsService.CollisionGroupSetCollidable(group.name, name, statement);
			}
		});
	}

	private apply(instance: Instance, groupName: string) {
		if (instance.IsA("BasePart")) {
			instance.CollisionGroup = groupName;
		} else if (instance.IsA("Model")) {
			instance.GetDescendants().forEach((descendant: Instance) => {
				if (descendant.IsA("BasePart")) descendant.CollisionGroup = groupName;
			});
		}
	}
}
