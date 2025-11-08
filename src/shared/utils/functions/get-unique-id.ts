import { HttpService } from "@rbxts/services";

export function getUniqueId() {
	return HttpService.GenerateGUID(false);
}
