import { Controller, OnStart } from "@flamework/core";
import CharmSync from "@rbxts/charm-sync";
import { Events } from "client/network";
import { sharedAtoms } from "shared/sync/state-sync-shared";

@Controller()
export class StateSyncController implements OnStart {
	private syncer = CharmSync.client({ atoms: sharedAtoms });

	public onStart() {
		Events.State.SyncState.connect((payloads) => this.syncer.sync(payloads));
		Events.State.RequestSyncState.fire();
	}
}
