import React from "@rbxts/react";
import { Environment } from "@rbxts/ui-labs";
import { Frame } from "./frame";

export interface LayerProps {
	children?: React.ReactNode;
	ResetOnSpawn?: boolean;
	IgnoreGuiInset?: boolean;
	DisplayOrder?: number;
	Enabled?: boolean;
}

const IS_STORY = Environment.IsStory();

export function Layer(props: LayerProps) {
	if (IS_STORY)
		return (
			<Frame
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Visible={props.Enabled}
				ZIndex={props.DisplayOrder}
				Size={UDim2.fromScale(1, 1)}
			>
				{props.children}
			</Frame>
		);

	return (
		<screengui
			ResetOnSpawn={props.ResetOnSpawn || false}
			IgnoreGuiInset={props.IgnoreGuiInset || true}
			DisplayOrder={props.DisplayOrder}
			Enabled={props.Enabled}
		>
			{props.children}
		</screengui>
	);
}
