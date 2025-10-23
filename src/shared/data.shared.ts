import { Atom, atom } from "@rbxts/charm";

export interface PlayerData {
	coins: number;
	inventory: Map<string, number>;
}

export type PlayerAtoms = { [K in keyof PlayerData]: Atom<PlayerData[K]> };

export const atoms: PlayerAtoms = {
	coins: atom(0),
	inventory: atom(new Map()),
};

export const testAtom = atom(1);
