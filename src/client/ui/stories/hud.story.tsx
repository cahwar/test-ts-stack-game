import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { HudRender } from "../components/view/hud/hud-render";

const controls = {};

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls: controls,
	story: () => {
		return <HudRender togglePage={() => {}}></HudRender>;
	},
};

export = story;
