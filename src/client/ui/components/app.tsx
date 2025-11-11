import React from "@rbxts/react";
import { Notifications } from "./view/text-notifications";
import { Pages } from "./view/pages";
import { HudWrapper } from "./view/hud";

export function App() {
	return (
		<>
			<Notifications></Notifications>
			<Pages></Pages>
			<HudWrapper></HudWrapper>
		</>
	);
}
