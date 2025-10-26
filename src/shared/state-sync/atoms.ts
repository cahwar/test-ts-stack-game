import { atom } from "@rbxts/charm";
import { Data } from "shared/store";

export const sharedAtoms = {
	test: atom(0),
	store: atom<Record<string, Data | undefined>>({}),
};

export type SharedAtoms = typeof sharedAtoms;
