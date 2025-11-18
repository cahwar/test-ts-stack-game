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
	) {}
}

export const NpcConfigs: NpcConfig[] = [
	new NpcConfig(getModel("Ninja"), "Ninja", 1000, false),
	new NpcConfig(getModel("Big Ninja"), "Big Ninja", 5000, true),
];

export function GetNpcConfig(name: string): NpcConfig | never {
	const config = NpcConfigs.find((value) => value.name === name);
	if (!config) error(`No NPC Config for ${name}`);
	return config;
}
