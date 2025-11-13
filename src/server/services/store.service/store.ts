import Lyra from "@rbxts/lyra";
import { sharedAtoms } from "shared/state-sync/atoms";
import { schema, template, migrationSteps, Data, dataName } from "shared/store";

function getMigrationStepsFromDescribtion(migrationStepsDescribtion: Record<string, Partial<Data>>) {
	const migrationSteps = [];

	for (const [stepName, stepRecord] of pairs(migrationStepsDescribtion)) {
		migrationSteps.push(Lyra.MigrationStep.addFields(stepName, stepRecord));
	}

	return migrationSteps;
}

function updateSharedDataAtom(key: string, data: Data) {
	sharedAtoms.store((state) => ({
		...state,
		[key]: data,
	}));
}

function removeSharedDataAtomKey(key: string) {
	sharedAtoms.store((state) => ({
		...state,
		[key]: undefined,
	}));
}

export const store = Lyra.createPlayerStore({
	name: dataName,
	template: template,
	schema: schema,
	migrationSteps: getMigrationStepsFromDescribtion(migrationSteps),
	changedCallbacks: [updateSharedDataAtom],
});

export function loadPlayer(player: Player) {
	store.load(player).catch((reason: unknown) => warn(`@${player.DisplayName} data load error:`, reason));
}

export function unloadPlayer(player: Player) {
	removeSharedDataAtomKey(tostring(player.UserId));
	store.unload(player).catch((reason: unknown) => warn(`@${player.DisplayName} data unload error:`, reason));
}
