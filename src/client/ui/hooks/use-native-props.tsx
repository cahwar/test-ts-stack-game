import React, { Ref } from "@rbxts/react";
import { BindedProperty } from "../types";

export interface NativeProps<T extends Instance> {
	ref?: Ref<T>;
	children?: React.ReactNode;
	Change?: React.InstanceChangeEvent<T>;
	Event?: React.InstanceEvent<T>;
	AnchorPoint?: BindedProperty<Vector2>;
	Position?: BindedProperty<UDim2>;
	Size?: BindedProperty<UDim2>;
	BackgroundTransparency?: BindedProperty<number>;
	BackgroundColor3?: BindedProperty<Color3>;
	Visible?: BindedProperty<boolean>;
	Rotation?: BindedProperty<number>;
	SizeConstraint?: Enum.SizeConstraint;
	ClipsDescendants?: boolean;
	LayoutOrder?: number;
	ZIndex?: number;
}

const NativeKeys = [
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
	"SizeConstraint",
	"ClipsDescendants",
	"LayoutOrder",
	"ZIndex",
];

export function useNativeProps<T extends Instance>(props: NativeProps<T>): Partial<NativeProps<T>> {
	const selected: Record<string, unknown> = {};

	for (const [k, v] of pairs(props)) {
		if (NativeKeys.includes(k)) {
			selected[k] = v;
		}
	}

	return selected;
}
