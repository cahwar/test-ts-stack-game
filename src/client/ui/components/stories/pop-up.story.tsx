import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { InferProps } from "@rbxts/ui-labs";
import { PopUpData } from "client/controllers/pop-up.controller";
import { getUniqueId } from "shared/utils/functions/get-unique-id";
import { PopUp } from "../view/pop-up/pop-up";
import { POWER_ICON } from "shared/constants/ui/icons";

const controls = { visible: true };

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls: controls,
	story: (props: InferProps<typeof controls>) => {
		const data: PopUpData = { text: "+5", icon: POWER_ICON, id: getUniqueId(), visible: props.controls.visible };

		return <PopUp data={data} playSound={() => {}} />;
	},
};

export = story;
