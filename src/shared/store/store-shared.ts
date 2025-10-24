import { t } from "@rbxts/t";

export const template = {
	coins: 0,
	gems: 0,
	items: new Map<string, number>(),
};

export const schema = t.strictInterface({
	coins: t.number,
	gems: t.number,
	items: t.map(t.string, t.number),
});

export const migrationFields = {
	addGems: { gems: 0 },
	addItems: { items: new Map<string, number>() },
};

export type PlayerData = typeof template;
export type PlayerDataElement = keyof PlayerData;
