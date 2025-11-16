import { Service } from "@flamework/core";
import { Debris, Workspace } from "@rbxts/services";
import { Events } from "server/network";
import { NpcConfig } from "shared/constants/configs/npc.config";

const DESTROY_EFFECT_TIME = 0.8;

const NPC_FOLDER = new Instance("Folder", Workspace);
NPC_FOLDER.Name = "Npc";

@Service()
export class NpcService {
	create(config: NpcConfig): Model {
		const instance = config.model.Clone();
		const humanoid = instance.FindFirstChildWhichIsA("Humanoid") as Humanoid;

		humanoid.Died.Once(() => {
			Events.Npc.Killed.broadcast(instance, DESTROY_EFFECT_TIME);
			Debris.AddItem(instance, DESTROY_EFFECT_TIME);
		});

		humanoid.Health = config.hp;
		humanoid.BreakJointsOnDeath = false;

		instance.Parent = NPC_FOLDER;
		instance.SetAttribute("DisplayName", config.name);
		instance.AddTag("Npc");
		instance.AddTag("Target");

		return instance;
	}
}
