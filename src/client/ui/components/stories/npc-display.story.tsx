import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { InferProps, Object } from "@rbxts/ui-labs";
import { NpcDisplay } from "../view/npc/npc-display-list/npc-display";
import { GetNpcConfig } from "shared/constants/configs/npc.config";
import { getUniqueId } from "shared/utils/functions/get-unique-id";

const controls = {
	instance: Object(),
};

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls: controls,
	story: (props: InferProps<typeof controls>) => {
		return {
			instance: props.controls.instance && (
				<NpcDisplay
					data={{
						instance: props.controls.instance as Model,
						config: GetNpcConfig("Ninja"),
						id: getUniqueId(),
					}}
				/>
			),
		};
	},
};

export = story;
