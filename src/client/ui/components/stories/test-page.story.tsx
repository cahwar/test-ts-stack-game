import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { InferProps } from "@rbxts/ui-labs";
import { TestPage } from "../view/pages/pages/test-page";

const controls = { enabled: true };

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls: controls,
	story: (props: InferProps<typeof controls>) => {
		return <TestPage enabled={props.controls.enabled}></TestPage>;
	},
};

export = story;
