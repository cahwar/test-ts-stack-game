import { t } from "@rbxts/t";

export const template = {
	coins: 0,
	gems: 0,
};

export const schema = t.strictInterface({
	coins: t.number,
	gems: t.number,
});

export const migrationFields = {
	addGems: { gems: 0 },
};

export type PlayerData = typeof template;
export type PlayerDataElement = keyof PlayerData;
