import React from "@rbxts/react";
import { AnimatedButton } from "client/ui/components/composables/animated-button";
import { Text } from "client/ui/components/composables/text";
import { usePx } from "client/ui/hooks/use-px";

export interface CommandButtonProps {
	commandName: string;
	sendRequest: (commandName: string) => void;
}

export function CommandButton({ commandName, sendRequest }: CommandButtonProps) {
	const px = usePx();

	return (
		<AnimatedButton
			Size={UDim2.fromScale(0.8, 0.15)}
			BackgroundColor3={Color3.fromRGB(227, 130, 166)}
			onMouseClick={() => sendRequest(commandName)}
			cornerRadius={new UDim(0, px(16))}
			useStroke={true}
			innerPaddingScale={new Vector2(1, 1.2)}
			ignoreHoverScale={true}
		>
			<Text
				Size={UDim2.fromScale(0.8, 0.8)}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Text={commandName}
				TextScaled={true}
				TextColor3={Color3.fromRGB(220, 200, 220)}
			/>
		</AnimatedButton>
	);
}
