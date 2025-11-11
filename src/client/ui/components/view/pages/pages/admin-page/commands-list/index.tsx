import React from "@rbxts/react";
import { usePx } from "client/ui/hooks/use-px";
import { CommandButton } from "./command-button";

export interface CommandsListProps {
	sendRequest: (commandName: string) => void;
	commands: Array<string>;
}

export function CommandsList({ sendRequest, commands }: CommandsListProps) {
	const px = usePx();
	return (
		<scrollingframe
			Size={UDim2.fromScale(0.8, 0.7)}
			Position={UDim2.fromScale(0.5, 0.25)}
			AnchorPoint={new Vector2(0.5, 0)}
			CanvasSize={UDim2.fromScale(0, 0)}
			AutomaticCanvasSize={Enum.AutomaticSize.Y}
			BorderSizePixel={0}
			BackgroundTransparency={1}
		>
			<uilistlayout
				Padding={new UDim(0, px(15))}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Top}
			></uilistlayout>

			{commands.map((value) => (
				<CommandButton commandName={value} sendRequest={sendRequest} />
			))}
		</scrollingframe>
	);
}
