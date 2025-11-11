import React from "@rbxts/react";
import { PageList } from "client/controllers/ui-page.controller";
import { usePx } from "client/ui/hooks/use-px";
import { Text } from "../../composables/text";
import { useKeyPress, useUpdateEffect } from "@rbxts/pretty-react-hooks";

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
		<imagebutton
			Event={{ MouseButton1Click: () => props.togglePage(PageList.admin) }}
			Position={UDim2.fromScale(0.95, 0.02)}
			Size={UDim2.fromOffset(px(100), px(32))}
			AnchorPoint={new Vector2(1, 0)}
			BackgroundColor3={Color3.fromRGB(50, 50, 50)}
			BackgroundTransparency={0.2}
			BorderSizePixel={0}
		>
			<Text
				Text={`Admin ${KEY}`}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.8, 0.8)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				TextScaled={true}
			/>
		</imagebutton>
	);
}
