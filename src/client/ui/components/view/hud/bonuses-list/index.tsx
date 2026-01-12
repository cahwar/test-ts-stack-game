import Object from "@rbxts/object-utils";
import React, { useEffect } from "@rbxts/react";
import { Frame } from "client/ui/components/composables/frame";
import { BonusData } from "shared/interfaces/bonus.interface";
import { BonusDisplay } from "./bonus-display";
import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import { springs } from "shared/constants/ui/springs";
import { usePx } from "client/ui/hooks/use-px";

export interface BonusesListProps {
	bonusesData: Record<string, Array<BonusData>>;
	enabled: boolean;
}

export function BonusesList(props: BonusesListProps) {
	const px = usePx();

	const [alpha, alphaMotor] = useMotion(0);

	useEffect(() => {
		alphaMotor.spring(props.enabled ? 1 : 0, springs.responsive);
	}, [props.enabled]);

	return (
		<Frame
			Size={new UDim2(0.2, 0, 0, px(80))}
			Position={lerpBinding(alpha, UDim2.fromScale(0.99, 2), UDim2.fromScale(0.99, 0.99))}
			AnchorPoint={new Vector2(1, 1)}
			BackgroundTransparency={1}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Right}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				Padding={new UDim(0, px(10))}
			/>

			{Object.entries(props.bonusesData).map((bonusEntry) => {
				const valueName = bonusEntry[0];
				const bonusesData = bonusEntry[1];

				return bonusesData.map((bonusData) => <BonusDisplay valueName={valueName} bonusData={bonusData} />);
			})}
		</Frame>
	);
}
