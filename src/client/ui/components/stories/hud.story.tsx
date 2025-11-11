import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { InferProps } from "@rbxts/ui-labs";
import { Hud } from "../view/hud/hud";

const controls = { enabled: true, showAdminButton: true };

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls: controls,
	story: (props: InferProps<typeof controls>) => {
		return (
			<Hud
				enabled={props.controls.enabled}
				showAdminButton={props.controls.showAdminButton}
				togglePage={() => {}}
			></Hud>
		);
	},
};

export = story;
