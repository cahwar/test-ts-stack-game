import React from "@rbxts/react";
import { Frame } from "client/ui/components/composables/frame";
import { Text } from "client/ui/components/composables/text";
import { usePx } from "client/ui/hooks/use-px";
import { MONEY_ICON } from "shared/constants/ui/icons";
import { BonusData } from "shared/interfaces/bonus.interface";
import { getFormattedNumberString } from "shared/utils/text-utils";

const FILLER_IMAGE = MONEY_ICON;

export interface BonusDisplayProps {
	valueName: string;
	bonusData: BonusData;
}

export function BonusDisplay(props: BonusDisplayProps) {
	const px = usePx();

	return (
		<Frame Size={UDim2.fromScale(1, 1)} SizeConstraint={Enum.SizeConstraint.RelativeYY} BackgroundTransparency={1}>
			<imagelabel
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				Image={props.bonusData.icon ?? FILLER_IMAGE}
			/>
			<Text
				Text={`+${getFormattedNumberString(props.bonusData.percent)}%`}
				Size={UDim2.fromScale(0.75, 0.45)}
				Position={UDim2.fromScale(1, 1)}
				AnchorPoint={new Vector2(1, 1)}
				TextScaled={true}
				TextXAlignment={Enum.TextXAlignment.Right}
				TextYAlignment={Enum.TextYAlignment.Bottom}
				strokeSize={px(2)}
			/>
		</Frame>
	);
}
