import { atom } from "@rbxts/charm";
import { PlayerData } from "shared/store/store-shared";

export const sharedAtoms = {
	store: atom<{ [K in StoreAtomOwnerIndex]: PlayerData | undefined }>({}),
	test: atom(0),
};

export type SharedAtoms = typeof sharedAtoms;
export type StoreAtomOwnerIndex = string;
