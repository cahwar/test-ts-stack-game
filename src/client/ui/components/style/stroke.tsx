import React from "@rbxts/react";
import { Property } from "client/ui/types";

import { getPlatform } from "shared/utils/functions/get-platform";

export interface StrokeProps {
	Size?: Property<number>;
	Color?: Property<Color3>;
}

const platform = getPlatform();

const DEFAULT_SIZE = 3;
const DEFAULT_COLOR = Color3.fromRGB(5, 5, 5);

export function Stroke({ Size: size = DEFAULT_SIZE, Color: color = DEFAULT_COLOR }: StrokeProps) {
	return <uistroke Thickness={platform === "Mobile" || platform === "Tablet" ? 1 : size} Color={color} />;
}
