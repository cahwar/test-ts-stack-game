import React from "@rbxts/react";
import { useBindedProperty } from "client/ui/hooks/use-binded-property";
import { BindedProperty } from "client/ui/types";
import { brighten } from "shared/utils/color-utils";

export interface CenterHiglightGradientProps {
	color: BindedProperty<Color3>;
	rotation?: number;
	intensity?: number;
}

export function CenterHighlightGradient({ color, rotation = 0, intensity = 0.5 }: CenterHiglightGradientProps) {
	return (
		<uigradient
			Rotation={rotation}
			Color={
				new ColorSequence([
					new ColorSequenceKeypoint(0, useBindedProperty(color)),
					new ColorSequenceKeypoint(0.5, brighten(useBindedProperty(color), intensity)),
					new ColorSequenceKeypoint(1, useBindedProperty(color)),
				])
			}
		/>
	);
}
