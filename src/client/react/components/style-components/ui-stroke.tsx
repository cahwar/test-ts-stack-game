import React from "@rbxts/react";
import { getPlatform } from "shared/utils/getPlatform";

interface StrokeProps {
	children?: React.ReactNode;
	thickness?: number;
	color?: Color3;
}

export function UIStroke({ thickness = 3, color = Color3.fromRGB(20, 20, 20), children }: StrokeProps) {
	const platform = getPlatform();

	return (
		<uistroke Thickness={platform === "Mobile" || platform === "Tablet" ? 1 : thickness} Color={color}>
			{children}
		</uistroke>
	);
}
