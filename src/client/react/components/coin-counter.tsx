import React from "@rbxts/react";
import { UIStroke } from "./style-components/ui-stroke";
import { useCoins } from "../hooks/useCoins";

export function CoinCounter() {
	return (
		<frame
			Size={UDim2.fromScale(0.1, 0.1)}
			AnchorPoint={new Vector2(0, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			BorderSizePixel={0}
			BackgroundTransparency={0.5}
		>
			<UIStroke></UIStroke>
			<textlabel
				Size={UDim2.fromScale(0.8, 0.8)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				BackgroundTransparency={1}
				Text={`${useCoins()}`}
				TextScaled={true}
				Font={Enum.Font.FredokaOne}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<UIStroke></UIStroke>
			</textlabel>
		</frame>
	);
}
