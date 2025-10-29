import Lyra from "@rbxts/lyra";
import { sharedAtoms } from "shared/state-sync/atoms";
import { schema, template, migrationSteps, Data } from "shared/store";

const getMigrationStepsFromDescribtion = (migrationStepsDescribtion: Record<string, Partial<Data>>) => {
	const migrationSteps = [];

	for (const [stepName, stepRecord] of pairs(migrationStepsDescribtion)) {
		migrationSteps.push(Lyra.MigrationStep.addFields(stepName, stepRecord));
	}

	return migrationSteps;
};

const updateSharedDataAtom = (key: string, data: Data) => {
	sharedAtoms.store((state) => ({
		...state,
		[key]: data,
	}));
};

const removeSharedDataAtomKey = (key: string) => {
	sharedAtoms.store((state) => ({
		...state,
		[key]: undefined,
	}));
};

export const store = Lyra.createPlayerStore({
	name: "Data_v1",
	template: template,
	schema: schema,
	migrationSteps: getMigrationStepsFromDescribtion(migrationSteps),
	changedCallbacks: [updateSharedDataAtom],
});

export const loadPlayer = (player: Player) => {
	store.load(player).catch((reason: unknown) => warn(`@${player.DisplayName} data load error:`, reason));
};

export const unloadPlayer = (player: Player) => {
	removeSharedDataAtomKey(tostring(player.UserId));
	store.unload(player).catch((reason: unknown) => warn(`@${player.DisplayName} data unload error:`, reason));
};
