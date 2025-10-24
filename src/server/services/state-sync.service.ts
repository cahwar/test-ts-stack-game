import { OnStart, Service } from "@flamework/core";
import CharmSync from "@rbxts/charm-sync";
import { Events } from "server/network";
import { sharedAtoms } from "shared/sync/state-sync-shared";
import { filterPayload } from "shared/sync/utils/filter-payload";
import Object from "@rbxts/object-utils";

@Service()
export class StateSyncService implements OnStart {
	private syncer = CharmSync.server({ atoms: sharedAtoms });

	public onStart() {
		this.syncer.connect((player, payloads) => {
			const filtered = filterPayload(player, payloads);
			const size = Object.keys(filtered.data).size();

			warn("server payload for", player.DisplayName);
			warn("=>>", filtered);
			warn("=>> Size:", size);

			const isEmpty =
				Object.isEmpty(filtered.data) ||
				(() => {
					for (const [, v] of pairs(filtered.data)) {
						if (!typeIs(v, "table")) return false;
						if (!Object.isEmpty(v)) return false;
					}

					return true;
				})();

			warn("=>> Is Empty:", isEmpty);

			if (isEmpty) {
				warn("=>> Skipping Payload");

				return;
			}

			Events.State.SyncState.fire(player, filtered);
		});

		Events.State.RequestSyncState.connect((player) => this.syncer.hydrate(player));
	}
}
