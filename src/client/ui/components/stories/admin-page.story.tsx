import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { InferProps } from "@rbxts/ui-labs";
import { AdminPage } from "../view/pages/pages/admin-page/admin-page";

const controls = { enabled: true };

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls: controls,
	story: (props: InferProps<typeof controls>) => {
		return (
			<AdminPage
				enabled={props.controls.enabled}
				sendRequest={() => {}}
				commands={["test_command_1", "test_command_2", "test_command_3"]}
			></AdminPage>
		);
	},
};

export = story;
