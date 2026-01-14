import React from "@rbxts/react";
import { Frame } from "client/ui/components/composables/frame";
import { Text } from "client/ui/components/composables/text";
import { usePx } from "client/ui/hooks/use-px";
import { BONUS_ICON } from "shared/constants/ui/icons";
import { BonusData, isExpiringBonusData } from "shared/interfaces/bonus.interface";
import { getFormattedNumberString } from "shared/utils/text-utils";
import { BonusExpireCounter } from "./bonus-expire-counter";

export interface BonusDisplayProps {
	bonusData: BonusData;
	setHoveredBonus: (bonusData: BonusData | undefined) => void;
}

export function BonusDisplay(props: BonusDisplayProps) {
	const px = usePx();

	return (
		<Frame
			Event={{
				MouseEnter: () => props.setHoveredBonus(props.bonusData),
				MouseLeave: () => props.setHoveredBonus(undefined),
			}}
			Size={UDim2.fromScale(1, 1)}
			SizeConstraint={Enum.SizeConstraint.RelativeYY}
			BackgroundTransparency={1}
			ZIndex={1}
		>
			{isExpiringBonusData(props.bonusData) && (
				<BonusExpireCounter startTime={props.bonusData.startTime} expiresIn={props.bonusData.expiresIn} />
			)}

			<imagelabel
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				Image={props.bonusData.icon ?? BONUS_ICON}
			/>
			<Text
				Text={`+${getFormattedNumberString(props.bonusData.percent)}%`}
				Size={UDim2.fromScale(0.75, 0.45)}
				Position={UDim2.fromScale(1, 1)}
				AnchorPoint={new Vector2(1, 1)}
				TextScaled={true}
				TextXAlignment={Enum.TextXAlignment.Right}
				TextYAlignment={Enum.TextYAlignment.Bottom}
				ZIndex={2}
				strokeSize={px(2)}
			/>
		</Frame>
	);
}
