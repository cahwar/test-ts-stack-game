import { useMemo } from "@rbxts/react";
import { getPlatform } from "shared/utils/functions/get-platform";

export function usePlatform() {
	return useMemo(() => getPlatform(), []);
}
