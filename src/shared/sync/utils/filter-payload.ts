import { SharedAtoms } from "../state-sync-shared";
import { SyncPayload } from "@rbxts/charm-sync";

export const filterPayload = (player: Player, payload: SyncPayload<SharedAtoms>) => {
	if (payload.type === "init") {
		return {
			...payload,

			data: {
				...payload.data,
				store: {
					[player.UserId]: payload.data.store[player.UserId],
				},
			},
		};
	}

	return {
		...payload,

		data: {
			...payload.data,
			store: {
				[player.UserId]: payload.data.store && payload.data.store[player.UserId],
			},
		},
	};
};
