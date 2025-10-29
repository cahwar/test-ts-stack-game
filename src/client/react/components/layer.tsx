import React from "@rbxts/react";

interface LayerProps {
	displayOrder?: number;
	children?: React.ReactNode;
}

export function Layer({ displayOrder, children }: LayerProps) {
	return (
		<screengui DisplayOrder={displayOrder} IgnoreGuiInset={true} ResetOnSpawn={false} ZIndexBehavior={"Sibling"}>
			{children}
		</screengui>
	);
}
