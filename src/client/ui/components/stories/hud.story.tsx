import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { InferProps } from "@rbxts/ui-labs";
import { Hud } from "../view/hud/hud";
import { MONEY_ICON, POWER_ICON } from "shared/constants/ui/icons";
import { BonusData } from "shared/interfaces/bonus.interface";

const controls = { enabled: true, showAdminButton: true, isClickerActive: false, bonusesAmount: 1 };

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls: controls,
	story: (props: InferProps<typeof controls>) => {
		const mockBonuses: BonusData[] = [];

		for (let i = 0; i < props.controls.bonusesAmount; i++) {
			mockBonuses.push({ valueName: "money", bonusName: `Test #${i}`, percent: 10 * i });
		}

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
				bonusesData={mockBonuses}
			></Hud>
		);
	},
};

export = story;
