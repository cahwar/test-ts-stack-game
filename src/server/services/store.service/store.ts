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

function updateStoreAtom(userId: string, data: Data) {
	sharedAtoms.store((state) => ({
		...state,
		[userId]: data,
	}));
}

function excludeFromStoreAtom(userId: string) {
	sharedAtoms.store((state) => ({
		...state,
		[userId]: undefined,
	}));
}

const changeListeners: Array<(userId: string, newData: Data, oldData?: Data) => void> = [];

function triggerChangeListeners(userId: string, newData: Data, oldData?: Data) {
	if (!oldData) return;

	changeListeners.forEach((listener) => listener(userId, newData, oldData));
}

export const store = Lyra.createPlayerStore({
	name: dataName,
	template: template,
	schema: schema,
	migrationSteps: getMigrationStepsFromDescribtion(migrationSteps),
	changedCallbacks: [updateStoreAtom, triggerChangeListeners],
});

export function loadPlayer(player: Player) {
	store.load(player).catch((reason: unknown) => warn(`@${player.DisplayName} data load error:`, reason));
}

export function unloadPlayer(player: Player) {
	excludeFromStoreAtom(tostring(player.UserId));
	store.unload(player).catch((reason: unknown) => warn(`@${player.DisplayName} data unload error:`, reason));
}

export function addListener(callback: (key: string, newData: Data, oldData?: Data) => void) {
	changeListeners.push(callback);
}
