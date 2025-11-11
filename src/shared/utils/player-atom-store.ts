import { atom } from "@rbxts/charm";

export class PlayerAtomStore<T> {
	private atom = atom<Record<string, T | undefined>>({});

	set(player: Player, value: T): void {
		this.atom((current) => ({ ...current, [tostring(player.UserId)]: value }));
	}

	get(player: Player): T | undefined {
		return this.atom()[tostring(player.UserId)];
	}

	remove(player: Player): void {
		this.atom((current) => ({ ...current, [tostring(player.UserId)]: undefined }));
	}
}
