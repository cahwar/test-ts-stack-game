/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Networking } from "@flamework/networking";
import { SyncPayload } from "@rbxts/charm-sync";
import { PlayerAtoms } from "./data.shared";

interface ClientToServerEvents {
	RequestSyncAtoms: () => void;
}

interface ServerToClientEvents {
	SyncAtoms: (payload: SyncPayload<PlayerAtoms>) => void;
}

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
