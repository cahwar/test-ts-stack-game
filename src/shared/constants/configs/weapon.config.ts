// export interface WeaponConfig {
// 	displayName?: string;
// 	damage: number;
// 	name: string;
// }

export class WeaponConfig {
	constructor(
		public readonly name: string,
		public readonly power: number,
		public readonly splashHits: number = 1,
		public readonly cooldown: number = 0.2,
		public readonly radius: number = 8,
	) {}
}

export const WeaponConfigs: Record<string, WeaponConfig> = {
	Katana: new WeaponConfig("Katana", 1),
	Axe: new WeaponConfig("Axe", 2),
};
