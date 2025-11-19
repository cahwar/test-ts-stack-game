import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { setInterval, setTimeout } from "@rbxts/set-timeout";
import { NpcService } from "server/services/npc.service";
import { GetNpcConfig, NpcConfig } from "shared/constants/configs/npc.config";
import { getPositiveOrNegative } from "shared/utils/functions/get-positive-or-negative";

interface NpcNodeAttributes {
	npcType: string;
	respawnDelay: number;
	travelDistance: number;
}

@Component({ tag: "NpcNode", defaults: { npcType: "Ninja", respawnDelay: 5, travelDistance: 15 } })
export class NpcNode extends BaseComponent<NpcNodeAttributes, BasePart> implements OnStart {
	private npc: Model | undefined = undefined;
	private config: NpcConfig = GetNpcConfig(this.attributes.npcType);

	constructor(private readonly npcService: NpcService) {
		super();
	}

	onStart(): void {
		this.createRecursional();

		this.instance.Transparency = 1;
	}

	private createRecursional() {
		this.npc = this.npcService.create(this.config);
		this.npc.PivotTo(this.instance.CFrame);

		const humanoid = this.npc.FindFirstChildWhichIsA("Humanoid") as Humanoid;

		const cleanupBehavior = setInterval(() => {
			if (humanoid.GetState() === Enum.HumanoidStateType.Dead) return;

			humanoid.RootPart?.SetNetworkOwner(undefined);

			humanoid.MoveTo(
				this.instance.Position.add(
					new Vector3(
						math.random(this.attributes.travelDistance) * getPositiveOrNegative(),
						0,
						math.random(this.attributes.travelDistance) * getPositiveOrNegative(),
					),
				),
			);
		}, 5);

		humanoid.Died.Once(() => {
			cleanupBehavior();
			setTimeout(() => this.createRecursional(), this.attributes.respawnDelay);
		});
	}
}
