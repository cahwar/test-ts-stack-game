import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { InferProps } from "@rbxts/ui-labs";
import { Hud } from "../view/hud/hud";
import { MONEY_ICON, POWER_ICON } from "shared/constants/ui/icons";

const controls = { enabled: true, showAdminButton: true, isClickerActive: false };

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls: controls,
	story: (props: InferProps<typeof controls>) => {
		return (
			<Hud
				enabled={props.controls.enabled}
				autoClicker={{ toggle: () => {}, isActive: props.controls.isClickerActive }}
				showAdminButton={props.controls.showAdminButton}
				togglePage={() => {}}
				currencyValues={[
					{ value: 1532, icon: POWER_ICON },
					{ value: 1532, icon: MONEY_ICON },
				]}
			></Hud>
		);
	},
};

export = story;
