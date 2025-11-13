import { t } from "@rbxts/t";

export const migrationSteps = {};
export const dataName = "Data_v2";
export const template = { money: 0, power: 0 };
export const schema = t.strictInterface({ money: t.number, power: t.number });

export type Data = typeof template;
export type DataKeys = keyof Data;
