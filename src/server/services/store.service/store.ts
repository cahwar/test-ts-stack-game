import { batch } from "@rbxts/charm";
import Lyra from "@rbxts/lyra";
import { migrationFields, PlayerData, schema, template } from "shared/store/store-shared";
import { sharedAtoms } from "shared/sync/state-sync-shared";

const updateSharedStoreState = (playerKey: string, data: PlayerData) => {
	batch(() => {
		sharedAtoms.store((currentState) => {
			return {
				...currentState,
				[playerKey]: data,
			};
		});
	});
};

const removeFromSharedStoreState = (playerKey: string) => {
	sharedAtoms.store((currentState) => {
		return {
			...currentState,
			[playerKey]: undefined,
		};
	});

	warn(sharedAtoms.store());
};

const getMigrationSteps = (migrateDescription: Record<string, Partial<PlayerData>>) => {
	const steps = [];

	for (const [stepName, fieldsData] of pairs(migrateDescription)) {
		steps.push(Lyra.MigrationStep.addFields(stepName, fieldsData));
	}

	return steps;
};

export const store = Lyra.createPlayerStore<PlayerData>({
	name: "TestData_v1",
	template: template,
	schema: schema,
	changedCallbacks: [updateSharedStoreState],
	migrationSteps: getMigrationSteps(migrationFields),
});

export const loadPlayer = (player: Player) => store.loadAsync(player);
export const unloadPlayer = (player: Player) => {
	removeFromSharedStoreState(tostring(player.UserId));
	store.unloadAsync(player);
};
