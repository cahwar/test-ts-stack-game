import React from "@rbxts/react";

export interface CornerProps {
	Radius: UDim | React.Binding<UDim>;
}

const DEFAULT_RADIUS = new UDim(0, 32);

export function Corner({ Radius: radius = DEFAULT_RADIUS }: CornerProps) {
	return <uicorner CornerRadius={radius} />;
}
