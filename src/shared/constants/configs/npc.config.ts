import { getReplicatedAsset } from "shared/utils/asset-utils";

const NPC_MODELS = getReplicatedAsset("Npc");

function getModel(name: string): Model {
	return NPC_MODELS.FindFirstChild(name) as Model;
}

export class NpcConfig {
	constructor(
		public readonly model: Model,
		public readonly name: string,
		public readonly hp: number,
		public readonly isBoss: boolean,
		public readonly reward: number,
	) {}
}

export const NpcConfigs: NpcConfig[] = [
	new NpcConfig(getModel("Ninja"), "Ninja", 100, false, 10),
	new NpcConfig(getModel("Big Ninja"), "Big Ninja", 5000, true, 50),
];

export function GetNpcConfig(name: string): NpcConfig | never {
	const config = NpcConfigs.find((value) => value.name === name);
	if (!config) error(`No NPC Config for ${name}`);
	return config;
}
