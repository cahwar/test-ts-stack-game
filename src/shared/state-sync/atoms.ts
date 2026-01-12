import { atom, Atom } from "@rbxts/charm";
import { BonusData } from "shared/interfaces/bonus.interface";
import { Data } from "shared/store";

type PlayerRecord<T> = Record<string, T | undefined>;

function PlayerRecordAtom<T>(): Atom<PlayerRecord<T>> {
	return atom<PlayerRecord<T>>({});
}

export const sharedAtoms = {
	store: PlayerRecordAtom<Data>(),
	bonuses: PlayerRecordAtom<Record<string, Array<BonusData>>>(),
};

export type SharedAtoms = typeof sharedAtoms;
