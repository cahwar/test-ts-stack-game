import { GuiService, UserInputService, Workspace } from "@rbxts/services";

export type Platform = "Console" | "Desktop" | "Mobile" | "Tablet";

export function getPlatform(): Platform {
	if (GuiService.IsTenFootInterface()) return "Console";

	if (UserInputService.TouchEnabled && !UserInputService.MouseEnabled) {
		return Workspace.CurrentCamera!.ViewportSize.Y > 600 ? "Tablet" : "Mobile";
	}

	return "Desktop";
}
