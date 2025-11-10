import React from "@rbxts/react";
import { useFlameworkDependency } from "client/ui/hooks/use-flamework-dependency";
import { PageList, UIPageController } from "client/controllers/ui-page.controller";
import { HudRender } from "./hud-render";

export function Hud() {
	const controller = useFlameworkDependency<UIPageController>();

	const togglePage = (page: PageList) => controller.toggle(page);

	return <HudRender togglePage={togglePage}></HudRender>;
}
