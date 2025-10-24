import { OnStart, Service } from "@flamework/core";
import CharmSync from "@rbxts/charm-sync";
import { Events } from "server/network";
import { sharedAtoms } from "shared/sync/state-sync-shared";
import { filterPayload } from "shared/sync/utils/filter-payload";

@Service()
export class StateSyncService implements OnStart {
	private syncer = CharmSync.server({ atoms: sharedAtoms });

	public onStart() {
		this.syncer.connect((player, payloads) => {
			warn("server payload for", player.DisplayName, filterPayload(player, payloads));
			Events.State.SyncState.fire(player, filterPayload(player, payloads));
		});

		Events.State.RequestSyncState.connect((player) => this.syncer.hydrate(player));
	}
}
