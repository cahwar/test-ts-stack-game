import { useBindingState } from "@rbxts/pretty-react-hooks";
import { BindedProperty } from "../types";

export function useBindedProperty<T>(property: BindedProperty<T>): T {
	if (typeOf(property) === "table" && (property as Record<string, unknown>)["getValue"] !== undefined)
		return useBindingState(property);
	return property as T;
}
