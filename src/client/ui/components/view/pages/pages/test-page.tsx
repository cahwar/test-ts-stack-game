import React from "@rbxts/react";
import { usePx } from "client/ui/hooks/use-px";
import { Page, PageActivityProps } from "../page";

export function TestPage({ enabled }: PageActivityProps) {
	const px = usePx();

	return (
		<Page
			enabled={enabled}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromOffset(px(600), px(350))}
			BackgroundColor3={Color3.fromRGB(15, 15, 15)}
		></Page>
	);
}
