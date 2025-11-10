import React from "@rbxts/react";

export interface CornerProps {
	radius: UDim | React.Binding<UDim>;
}

const DEFAULT_RADIUS = new UDim(0.1, 0);

export function Corner({ radius = DEFAULT_RADIUS }: CornerProps) {
	return <uicorner CornerRadius={radius} />;
}
