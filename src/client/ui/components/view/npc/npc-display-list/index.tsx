import Object from "@rbxts/object-utils";
import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { NpcController } from "client/controllers/npc.controller";
import { useFlameworkDependency } from "client/ui/hooks/use-flamework-dependency";
import { NpcDisplay } from "./npc-display";

export function NpcDisplayList() {
	const npcController = useFlameworkDependency<NpcController>();

	const npcs = useAtom(() => npcController.getList());

	return (
		<>
			{Object.entries(npcs).map((value) => (
				<NpcDisplay data={value[1]} key={value[1].id} />
			))}
		</>
	);
}
