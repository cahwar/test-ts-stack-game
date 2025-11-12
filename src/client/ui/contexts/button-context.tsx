import { createContext, useContext } from "@rbxts/react";

export interface ButtonContext {
	hovered: boolean;
	pressed: boolean;
}

export const ButtonContext = createContext<ButtonContext | undefined>(undefined);

export function useButtonContext(): ButtonContext {
	const context = useContext(ButtonContext);

	return context ?? { hovered: false, pressed: false };
}
