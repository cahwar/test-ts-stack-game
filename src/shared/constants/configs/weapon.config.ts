// export interface WeaponConfig {
// 	displayName?: string;
// 	damage: number;
// 	name: string;
// }

export class WeaponConfig {
	constructor(
		public readonly damage: number,
		public readonly name: string,
		public readonly displayName?: string,
		public readonly cooldown: number = 0.2,
		public readonly radius: number = 8,
	) {}
}

export const WeaponConfigs: Record<string, WeaponConfig> = {
	Katana: new WeaponConfig(20, "Katana"),
	Axe: new WeaponConfig(15, "Axe"),
};
