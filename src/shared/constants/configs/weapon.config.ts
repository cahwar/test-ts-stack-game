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

export const WeaponConfigs: WeaponConfig[] = [new WeaponConfig("Katana", 1), new WeaponConfig("Axe", 2)];

export function GetWeaponConfig(name: string): WeaponConfig | never {
	const config = WeaponConfigs.find((value) => value.name === name);
	if (config === undefined) error(`No weapon config for ${name}`);
	return config;
}
