import React from "@rbxts/react";
import { Frame } from "client/ui/components/composables/frame";
import { usePx } from "client/ui/hooks/use-px";
import { PageButtonList } from "./page-button-list";

export function LeftBar() {
	const px = usePx();

	return (
		<Frame
			AnchorPoint={new Vector2(0, 0)}
			Position={new UDim2(0, px(20), 0.1, 0)}
			Size={new UDim2(0.2, 0, 0.6, 0)}
			BackgroundTransparency={0.5}
		>
			<>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					FillDirection={Enum.FillDirection.Vertical}
					VerticalFlex={Enum.UIFlexAlignment.SpaceEvenly}
				></uilistlayout>

				<PageButtonList></PageButtonList>
			</>
		</Frame>
	);
}
