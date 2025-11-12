import React from "@rbxts/react";
import { PageList } from "client/controllers/ui-page.controller";
import { usePx } from "client/ui/hooks/use-px";
import { Text } from "../../composables/text";
import { useKeyPress, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { AnimatedButton } from "../../composables/animated-button";

const KEY = "F8";

export interface AdminButtonProps {
	togglePage: (page: PageList) => void;
}

export function AdminButton(props: AdminButtonProps) {
	const px = usePx();

	const isKeyPressed = useKeyPress([KEY]);
	useUpdateEffect(() => {
		if (isKeyPressed) {
			props.togglePage(PageList.admin);
		}
	}, [isKeyPressed]);

	return (
		<AnimatedButton
			Position={UDim2.fromScale(0.95, 0.02)}
			Size={UDim2.fromOffset(px(100), px(32))}
			AnchorPoint={new Vector2(1, 0)}
			BackgroundColor3={Color3.fromRGB(173, 92, 245)}
			BackgroundTransparency={0.2}
			onMouseClick={() => {
				props.togglePage(PageList.admin);
			}}
			useStroke={true}
		>
			<Text
				Text={`Admin (${KEY})`}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.8, 0.8)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				TextScaled={true}
			/>
		</AnimatedButton>
	);
}
