import Object from "@rbxts/object-utils";
import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { NpcController } from "client/controllers/npc.controller";
import { Layer } from "client/ui/components/composables/layer";
import { useFlameworkDependency } from "client/ui/hooks/use-flamework-dependency";
import { BossFrame } from "./boss-frame";
import { TargetController } from "client/controllers/target.controller";

export function BossFrameWrapper() {
	const targetController = useFlameworkDependency<TargetController>();
	const npcController = useFlameworkDependency<NpcController>();

	const boss = useAtom(
		() =>
			Object.entries(targetController.getList())
				.filter((value) => npcController.isNpc(value[0]))
				.map((value) => npcController.getNpcData(value[0]))
				.filter((value) => value.config.isBoss)[0],
	);

	return (
		<Layer>
			<BossFrame data={boss} />
		</Layer>
	);
}
