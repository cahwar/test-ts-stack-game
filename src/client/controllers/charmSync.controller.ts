import { Controller, OnStart } from "@flamework/core";
import CharmSync from "@rbxts/charm-sync";
import { atoms } from "shared/data.shared";
import { Events } from "client/network";
import { subscribe } from "@rbxts/charm";

@Controller()
export class CharmSyncController implements OnStart {
	private syncer = CharmSync.client({ atoms: atoms });

	public onStart() {
		subscribe(atoms.coins, (state) => {
			warn(`from client coins: ${state}`);
		});
		Events.SyncAtoms.connect((payload) => this.syncer.sync(payload));

		Events.RequestSyncAtoms.fire();
	}
}
