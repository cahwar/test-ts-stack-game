import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { InferProps, Object } from "@rbxts/ui-labs";
import { Floater } from "../view/floaters/floater";
import { MONEY_ICON } from "shared/constants/ui/icons";

const controls = {
	adornee: Object(),
	visible: true,
};

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls: controls,
	story: (props: InferProps<typeof controls>) => {
		return (
			<Floater
				data={{
					id: "1",
					text: "+35",
					icon: MONEY_ICON,
					visible: props.controls.visible,
					adornee: props.controls.adornee as Instance,
				}}
			></Floater>
		);
	},
};

export = story;
