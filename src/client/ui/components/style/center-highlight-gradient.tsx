import React from "@rbxts/react";
import { brighten } from "shared/utils/color-utils";

export interface CenterHiglightGradientProps {
	PrimaryColor: Color3;
	Rotation?: number;
}

export function CenterHighlightGradient({ PrimaryColor, Rotation = 0 }: CenterHiglightGradientProps) {
	return (
		<uigradient
			Rotation={Rotation}
			Color={
				new ColorSequence([
					new ColorSequenceKeypoint(0, PrimaryColor),
					new ColorSequenceKeypoint(0.5, brighten(PrimaryColor, 0.7)),
					new ColorSequenceKeypoint(1, PrimaryColor),
				])
			}
		/>
	);
}
