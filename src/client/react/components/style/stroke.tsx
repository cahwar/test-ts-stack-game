import React from "@rbxts/react";
import { Property } from "client/react/types";

import { getPlatform } from "shared/utils/get-platform";

export interface StrokeProps {
	Size?: Property<number>;
	Color?: Property<Color3>;
}

const platform = getPlatform();

const DEFAULT_SIZE = 3;
const DEFAULT_COLOR = Color3.fromRGB(25, 25, 25);

export function Stroke({ Size: size = DEFAULT_SIZE, Color: color = DEFAULT_COLOR }: StrokeProps) {
	return <uistroke Thickness={platform === "Mobile" || platform === "Tablet" ? 1 : size} Color={color} />;
}
