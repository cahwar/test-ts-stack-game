import { Service } from "@flamework/core";
import { Debris, Workspace } from "@rbxts/services";
import { Events } from "server/network";
import { GetNpcConfig, NpcConfig } from "shared/constants/configs/npc.config";
import { getUniqueId } from "shared/utils/functions/get-unique-id";
import { StoreService } from "../store.service";
import { emitMagnetable } from "server/utils/emit-magnetable";
import { MONEY_ICON } from "shared/constants/ui/icons";

const DESTROY_EFFECT_TIME = 0.8;

const NPC_FOLDER = new Instance("Folder", Workspace);
NPC_FOLDER.Name = "Npc";

@Service()
export class NpcService {
	constructor(private readonly storeService: StoreService) {}

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
		instance.SetAttribute("ConfigName", config.name);
		instance.SetAttribute("Id", getUniqueId());
		instance.AddTag("Npc");
		instance.AddTag("Target");

		const hitPart = instance.PrimaryPart ?? instance.FindFirstChildWhichIsA("BasePart");
		hitPart?.AddTag("TargetHitPart");

		return instance;
	}

	isNpc(instance: Instance): boolean {
		return instance.HasTag("Npc");
	}

	countKill(player: Player, npc: Model): void {
		const config = GetNpcConfig(npc.GetAttribute("ConfigName") as string);
		this.storeService.updateValue(player, "money", (value) => value + config.reward);
		emitMagnetable(
			player,
			npc.PrimaryPart?.Position ?? npc.GetPivot().Position,
			MONEY_ICON,
			math.clamp(math.ceil(config.reward / 10), 2, 5),
		);
	}
}
