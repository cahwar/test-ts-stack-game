import React, { Ref } from "@rbxts/react";
import { Property } from "../types";

export interface InstanceProps<T extends Instance> {
	ref?: Ref<T>;
	children?: React.ReactNode;
	Change?: React.InstanceChangeEvent<T>;
	Event?: React.InstanceEvent<T>;
	AnchorPoint?: Property<Vector2>;
	Position?: Property<UDim2>;
	Size?: Property<UDim2>;
	BackgroundTransparency?: Property<number>;
	BackgroundColor3?: Property<Color3>;
	Visible?: Property<boolean>;
	Rotation?: Property<number>;
	LayoutOrder?: number;
	ZIndex?: number;
}

export const InstancePropsKeys = [
	"ref",
	"Change",
	"Event",
	"AnchorPoint",
	"Position",
	"Size",
	"BackgroundTransparency",
	"BackgroundColor3",
	"Visible",
	"Rotation",
	"LayoutOrder",
	"ZIndex",
];

export function selectInstanceProps<T extends Instance>(props: InstanceProps<T>) {
	const selected: Record<string, unknown> = {};

	for (const [k, v] of pairs(props)) {
		if (InstancePropsKeys.includes(k)) {
			selected[k] = v;
		}
	}

	return selected;
}
