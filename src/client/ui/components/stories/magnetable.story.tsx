import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { InferProps, Object } from "@rbxts/ui-labs";
import { MONEY_ICON } from "shared/constants/ui/icons";
import { Magnetable } from "../view/magnetable/magnetable";
import { getUniqueId } from "shared/utils/functions/get-unique-id";

const controls = {
	adornee: Object(),
	icon: MONEY_ICON,
	visible: true,
};

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls: controls,
	story: (props: InferProps<typeof controls>) => {
		return (
			props.controls.adornee && (
				<Magnetable
					data={{
						visible: props.controls.visible,
						adornee: props.controls.adornee as BasePart,
						icon: props.controls.icon,
						id: getUniqueId(),
					}}
				/>
			)
		);
	},
};

export = story;
