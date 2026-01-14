export interface BonusData {
	valueName: string;
	bonusName: string;
	percent: number;
	expiresIn?: number;
	startTime?: number;
	displayName?: string;
	description?: string;
	icon?: string;
}
export function isExpiringBonusData(
	bonusData: BonusData,
): bonusData is BonusData & { expiresIn: number; startTime: number } {
	return "startTime" in bonusData && "expiresIn" in bonusData;
}
