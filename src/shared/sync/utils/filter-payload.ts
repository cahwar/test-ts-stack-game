import { SharedAtoms } from "../state-sync-shared";
import { SyncPayload } from "@rbxts/charm-sync";

export const filterPayload = (player: Player, payload: SyncPayload<SharedAtoms>) => {
	if (payload.type === "init") {
		return {
			...payload,

			data: {
				...payload.data,
				store: {
					[tostring(player.UserId)]: payload.data.store[tostring(player.UserId)],
				},
			},
		};
	}

	warn("store like", payload.data.store);

	return {
		...payload,

		data: {
			...payload.data,
			store: {
				[tostring(player.UserId)]: payload.data.store && payload.data.store[tostring(player.UserId)],
			},
		},
	};
};
