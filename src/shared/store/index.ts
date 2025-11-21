import { t } from "@rbxts/t";

export const migrationSteps = {};
export const dataName = "Data_v4";
export const template = { money: 0, power: 0, weapon: "Katana", passes: new Map<string, boolean>() };
export const schema = t.strictInterface({
	money: t.number,
	power: t.number,
	weapon: t.string,
	passes: t.map(t.string, t.boolean),
});

export type Data = typeof template;
export type DataKeys = keyof Data;
