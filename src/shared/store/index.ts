import { t } from "@rbxts/t";

export const migrationSteps = {};
export const dataName = "Data_v3";
export const template = { money: 0, power: 0, weapon: "Katana" };
export const schema = t.strictInterface({ money: t.number, power: t.number, weapon: t.string });

export type Data = typeof template;
export type DataKeys = keyof Data;
