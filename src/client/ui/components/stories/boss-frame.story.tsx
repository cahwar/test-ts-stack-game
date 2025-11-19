import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { InferProps, Object } from "@rbxts/ui-labs";
import { BossFrame } from "../view/npc/boss-frame/boss-frame";
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
		return (
			<BossFrame
				data={
					props.controls.instance && {
						instance: props.controls.instance as Model,
						config: GetNpcConfig("Big Ninja"),
						id: getUniqueId(),
					}
				}
			/>
		);
	},
};

export = story;
