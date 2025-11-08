import React from "@rbxts/react";
import { brighten } from "shared/utils/color-utils";

export interface BackgroundGradientProps {
	PrimaryColor: Color3;
	Rotation?: number;
}

export function BackgroundGradient({ PrimaryColor, Rotation = 90 }: BackgroundGradientProps) {
	return (
		<uigradient
			Rotation={Rotation}
			Color={
				new ColorSequence([
					new ColorSequenceKeypoint(0, brighten(PrimaryColor, 0.1)),
					new ColorSequenceKeypoint(1, PrimaryColor),
				])
			}
		/>
	);
}
