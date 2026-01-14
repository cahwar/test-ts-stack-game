import { t } from "@rbxts/t";

export interface BonusData {
	valueName: string;
	bonusName: string;
	percent: number;
	expiresIn: number | undefined;
	startTime: number | undefined;
	displayName: string | undefined;
	description: string | undefined;
	icon: string | undefined;
}

export const BonusDataCheck = t.strictInterface({
	valueName: t.string,
	bonusName: t.string,
	percent: t.number,
	expiresIn: t.optional(t.number),
	startTime: t.optional(t.number),
	displayName: t.optional(t.string),
	description: t.optional(t.string),
	icon: t.optional(t.string),
});

export function isExpiringBonusData(
	bonusData: BonusData,
): bonusData is BonusData & { expiresIn: number; startTime: number } {
	return "startTime" in bonusData && "expiresIn" in bonusData;
}
