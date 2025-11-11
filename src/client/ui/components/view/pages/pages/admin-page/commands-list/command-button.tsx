import React from "@rbxts/react";
import { Text } from "client/ui/components/composables/text";
import { Corner } from "client/ui/components/style/corner";
import { usePx } from "client/ui/hooks/use-px";

export interface CommandButtonProps {
	commandName: string;
	sendRequest: (commandName: string) => void;
}

export function CommandButton({ commandName, sendRequest }: CommandButtonProps) {
	const px = usePx();

	return (
		<imagebutton
			Size={UDim2.fromScale(1, 0.15)}
			BorderSizePixel={0}
			BackgroundColor3={Color3.fromRGB(227, 130, 166)}
			Event={{ MouseButton1Click: () => sendRequest(commandName) }}
		>
			<Corner radius={new UDim(0, px(16))} />
			<Text
				Size={UDim2.fromScale(0.8, 0.8)}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Text={commandName}
				TextScaled={true}
				TextColor3={Color3.fromRGB(220, 200, 220)}
			/>
		</imagebutton>
	);
}
