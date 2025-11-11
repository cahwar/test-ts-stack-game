/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Networking } from "@flamework/networking";
import { SyncPayload } from "@rbxts/charm-sync";
import { SharedAtoms } from "./state-sync/atoms";

interface ClientToServerEvents {
	State: {
		RequestSyncState: () => void;
	};

	Admin: {
		ProcessCommand: (name: string) => void;
	};

	Click: () => void;
}

interface ServerToClientEvents {
	State: {
		SyncState: (payloads: SyncPayload<SharedAtoms>) => void;
	};

	Notifications: {
		Add: (message: string, duration: number) => void;
	};
}

interface ClientToServerFunctions {
	Admin: {
		GetCommands: () => Array<string>;
		HasAccess: () => boolean;
	};
}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
