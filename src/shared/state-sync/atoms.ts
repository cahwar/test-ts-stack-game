import { atom } from "@rbxts/charm";
import { Data } from "shared/store";

export const sharedAtoms = {
	clickCooldown: atom<Record<string, number | undefined>>({}),
	store: atom<Record<string, Data | undefined>>({}),
};

export type SharedAtoms = typeof sharedAtoms;
