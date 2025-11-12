import React from "@rbxts/react";
import { usePx } from "client/ui/hooks/use-px";
import { BindedProperty } from "client/ui/types";

export interface StrokeProps {
	size?: BindedProperty<number>;
	color?: BindedProperty<Color3>;
}

const DEFAULT_SIZE = 3;
const DEFAULT_COLOR = Color3.fromRGB(5, 5, 5);

export function Stroke({ size, color = DEFAULT_COLOR }: StrokeProps) {
	const px = usePx();

	return <uistroke Thickness={size ?? px(DEFAULT_SIZE)} Color={color} />;
}
