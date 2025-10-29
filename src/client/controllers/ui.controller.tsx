import { Controller, OnStart } from "@flamework/core";
import React from "@rbxts/react";
import { StrictMode } from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import { App } from "client/react/components/app";

@Controller()
export class UIController implements OnStart {
	onStart(): void {
		const root = createRoot(new Instance("Folder"));
		const target = Players.LocalPlayer.WaitForChild("PlayerGui");

		root.render(<StrictMode>{createPortal(<App />, target)}</StrictMode>);
	}
}
