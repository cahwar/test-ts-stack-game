import { t } from "@rbxts/t";

export const migrationSteps = {};
export const dataName = "Data_v7";
export const template = {
	money: 0,
	gems: 0,
	power: 0,
	rebirthCount: 0,
	ownedWeapons: new Map<string, string>([["Katana", "0"]]),
	weapon: "Katana",
	passes: new Map<string, boolean>(),
};

export const schema = t.strictInterface({
	money: t.number,
	gems: t.number,
	power: t.number,
	rebirthCount: t.number,
	ownedWeapons: t.map(t.string, t.string),
	weapon: t.string,
	passes: t.map(t.string, t.boolean),
});

export type Data = typeof template;
export type DataKeys = keyof Data;
