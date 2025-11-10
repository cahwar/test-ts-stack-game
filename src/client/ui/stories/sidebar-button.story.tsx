import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { SidebarButton } from "../components/view/hud/sidebar-button";

const controls = {};

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls: controls,
	story: () => {
		return <SidebarButton></SidebarButton>;
	},
};

export = story;
