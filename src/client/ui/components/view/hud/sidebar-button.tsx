import React from "@rbxts/react";
import { ReactiveButton } from "../../composables/reactive-button";
import { usePx } from "client/ui/hooks/use-px";

export function SidebarButton() {
	const px = usePx();

	return (
		<ReactiveButton
			BackgroundColor3={Color3.fromRGB(50, 50, 50)}
			StrokeSize={4}
			CornerRadius={new UDim(0, px(8))}
			Position={new UDim2(0, px(30), 0.5, 0)}
			AnchorPoint={new Vector2(0, 0.5)}
			Size={UDim2.fromOffset(px(60), px(60))}
		></ReactiveButton>
	);
}
