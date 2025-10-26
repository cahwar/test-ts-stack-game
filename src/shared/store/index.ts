import { t } from "@rbxts/t";

export const migrationSteps = {};
export const template = { coins: 0, inventory: new Map<string, number>() };
export const schema = t.strictInterface({ coins: t.number, inventory: t.map(t.string, t.number) });

export type Data = typeof template;
export type DataKeys = keyof Data;
