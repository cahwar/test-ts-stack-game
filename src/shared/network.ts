/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Networking } from "@flamework/networking";
import { SyncPayload } from "@rbxts/charm-sync";
import { SharedAtoms } from "./sync/state-sync-shared";

interface ClientToServerEvents {
	State: {
		RequestSyncState: () => void;
	};
}

interface ServerToClientEvents {
	State: {
		SyncState: (payloads: SyncPayload<SharedAtoms>) => void;
	};
}

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
