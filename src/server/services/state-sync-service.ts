import { OnInit, Service } from "@flamework/core";
import CharmSync from "@rbxts/charm-sync";
import Object from "@rbxts/object-utils";
import { Events } from "server/network";
import { SharedAtoms, sharedAtoms } from "shared/state-sync/atoms";

function filterPlayerPayload(player: Player, payloads: CharmSync.SyncPayload<SharedAtoms>) {
	if (payloads.type === "init") {
		return {
			...payloads,
			data: {
				...payloads.data,
				store: { [tostring(player.UserId)]: payloads.data.store[tostring(player.UserId)] },
			},
		};
	}

	return {
		...payloads,
		data: {
			...payloads.data,
			store: { [tostring(player.UserId)]: payloads.data.store && payloads.data.store[tostring(player.UserId)] },
		},
	};
}

function isPayloadEmpty(payloads: CharmSync.SyncPayload<SharedAtoms>) {
	if (Object.isEmpty(payloads.data)) return true;

	for (const [, value] of pairs(payloads.data)) {
		if (!typeIs(value, "table")) return false;
		if (!Object.isEmpty(value)) return false;
	}

	return true;
}

@Service()
export class StateSyncService implements OnInit {
	private syncer = CharmSync.server({ atoms: sharedAtoms });

	public onInit() {
		this.syncer.connect((player: Player, payloads: CharmSync.SyncPayload<SharedAtoms>) => {
			const filteredPayload = filterPlayerPayload(player, payloads);
			const isEmpty = isPayloadEmpty(filteredPayload);

			if (!isEmpty) {
				Events.State.SyncState.fire(player, payloads);
			}
		});

		Events.State.RequestSyncState.connect((player) => this.syncer.hydrate(player));
	}
}
