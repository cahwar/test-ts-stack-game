import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { AnimatedButton } from "../composables/animated-button";
import { usePx } from "client/ui/hooks/use-px";
import { CenterHighlightGradient } from "../style/center-highlight-gradient";
import { HoverTilt } from "../composables/hover-tilt";
import { Text } from "../composables/text";

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls: {},
	story: () => {
		const px = usePx();

		return (
			<AnimatedButton
				Size={UDim2.fromOffset(px(100), px(100))}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				useStroke={true}
				strokeSize={px(5)}
				cornerRadius={new UDim(0, px(8))}
			>
				<CenterHighlightGradient color={Color3.fromRGB(250, 158, 77)}></CenterHighlightGradient>

				<HoverTilt
					Size={UDim2.fromScale(1, 0.25)}
					Position={UDim2.fromScale(0.5, 0.7)}
					AnchorPoint={new Vector2(0.5, 0)}
					Rotation={0}
					useButtonContext={true}
				>
					<Text
						Size={UDim2.fromScale(1, 1)}
						Position={UDim2.fromScale(0.5, 0.5)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						TextScaled={true}
						Text="Title"
					></Text>
				</HoverTilt>
			</AnimatedButton>
		);
	},
};

export = story;
