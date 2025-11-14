import React from "@rbxts/react";
import { Notifications } from "./view/text-notifications";
import { Pages } from "./view/pages";
import { HudWrapper } from "./view/hud";
import { PopUpWrapper } from "./view/pop-up";

export function App() {
	return (
		<>
			<Notifications></Notifications>
			<Pages></Pages>
			<HudWrapper></HudWrapper>
			<PopUpWrapper></PopUpWrapper>
		</>
	);
}
