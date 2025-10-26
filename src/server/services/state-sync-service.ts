import { OnInit, Service } from "@flamework/core";
import CharmSync from "@rbxts/charm-sync";
import Object from "@rbxts/object-utils";
import { Events } from "server/network";
import { SharedAtoms, sharedAtoms } from "shared/state-sync/atoms";

const filterPlayerPayload = (player: Player, payloads: CharmSync.SyncPayload<SharedAtoms>) => {
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
};

const isPayloadEmpty = (payloads: CharmSync.SyncPayload<SharedAtoms>) => {
	if (Object.isEmpty(payloads.data)) return true;

	for (const [, value] of pairs(payloads.data)) {
		if (!typeIs(value, "table")) return false;
		if (!Object.isEmpty(value)) return false;
	}

	return true;
};

@Service()
export class StateSyncService implements OnInit {
	private syncer = CharmSync.server({ atoms: sharedAtoms });

	public onInit() {
		this.syncer.connect((player: Player, payloads: CharmSync.SyncPayload<SharedAtoms>) => {
			warn(string.rep("=", 20));
			warn("Server Payloads", player.DisplayName);

			const filteredPayload = filterPlayerPayload(player, payloads);
			const isEmpty = isPayloadEmpty(filteredPayload);

			warn("==>", filteredPayload);
			warn("==> Empty:", isEmpty);

			if (!isEmpty) {
				warn("=>> Firing", player.DisplayName);
				Events.State.SyncState.fire(player, payloads);
			} else {
				warn("=>> Not Firing", player.DisplayName);
			}
		});

		Events.State.RequestSyncState.connect((player) => this.syncer.hydrate(player));
	}
}
