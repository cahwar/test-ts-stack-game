import React, { useEffect, useState } from "@rbxts/react";
import { Frame } from "client/ui/components/composables/frame";
import { BonusData } from "shared/interfaces/bonus.interface";
import { BonusDisplay } from "./bonus-display";
import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import { springs } from "shared/constants/ui/springs";
import { usePx } from "client/ui/hooks/use-px";
import { BonusTooltip } from "./bonus-tooltip";

export interface BonusesListProps {
	bonusesData: BonusData[];
	enabled: boolean;
}

export function BonusesList(props: BonusesListProps) {
	const px = usePx();

	const [hoveredBonus, setHoveredBonus] = useState<BonusData | undefined>(undefined);
	const [alpha, alphaMotor] = useMotion(0);

	useEffect(() => {
		alphaMotor.spring(props.enabled ? 1 : 0, springs.responsive);
	}, [props.enabled]);

	return (
		<>
			<BonusTooltip enabled={props.enabled} bonusData={hoveredBonus} />

			<Frame
				Size={new UDim2(0.2, 0, 0, px(50))}
				Position={lerpBinding(alpha, UDim2.fromScale(0.01, 2), UDim2.fromScale(0.01, 0.99))}
				AnchorPoint={new Vector2(0, 1)}
				BackgroundTransparency={1}
			>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0, px(10))}
				/>

				{props.bonusesData.map((bonusData) => {
					return (
						<BonusDisplay
							key={bonusData.bonusName}
							bonusData={bonusData}
							setHoveredBonus={setHoveredBonus}
						/>
					);
				})}
			</Frame>
		</>
	);
}
