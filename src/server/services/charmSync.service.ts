import { OnInit, Service } from "@flamework/core";
import CharmSync from "@rbxts/charm-sync";
import { atoms } from "shared/data.shared";
import { Events } from "server/network";

@Service()
export class CharmSyncService implements OnInit {
	private syncer = CharmSync.server({ atoms: atoms });

	public onInit() {
		this.syncer.connect((player, payload) => {
			Events.SyncAtoms.fire(player, payload);
		});

		Events.RequestSyncAtoms.connect((player) => this.syncer.hydrate(player));
	}
}
