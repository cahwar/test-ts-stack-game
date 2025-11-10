import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Hud } from "../components/view/hud";

const controls = {};

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls: controls,
	story: () => {
		return <Hud></Hud>;
	},
};

export = story;
