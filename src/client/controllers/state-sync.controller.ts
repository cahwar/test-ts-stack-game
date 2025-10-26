import { Controller, OnStart } from "@flamework/core";
import CharmSync, { SyncPayload } from "@rbxts/charm-sync";
import { Events } from "client/network";
import { SharedAtoms, sharedAtoms } from "shared/state-sync/atoms";

@Controller()
export class StateSyncController implements OnStart {
	private syncer = CharmSync.client({ atoms: sharedAtoms });

	public onStart() {
		Events.State.SyncState.connect((payloads: SyncPayload<SharedAtoms>) => {
			warn("Controller Payloads", payloads);
			this.syncer.sync(payloads);
		});

		Events.State.RequestSyncState.fire();
	}
}
