import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { InferProps } from "@rbxts/ui-labs";
import { POWER_ICON } from "shared/constants/ui/icons";
import { ValueDisplay } from "../view/hud/value-display";

const controls = { value: 1234, icon: POWER_ICON };

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls: controls,
	story: (props: InferProps<typeof controls>) => {
		return <ValueDisplay value={props.controls.value} icon={props.controls.icon}></ValueDisplay>;
	},
};

export = story;
