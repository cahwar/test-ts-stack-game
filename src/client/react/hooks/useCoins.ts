import { Dependency } from "@flamework/core";
import { useAtom } from "@rbxts/react-charm";
import { StoreController } from "client/controllers/store.controller";

export function useCoins() {
	return useAtom(() => Dependency<StoreController>().getValueAsync("coins"));
}
