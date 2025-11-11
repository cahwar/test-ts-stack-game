import React from "@rbxts/react";
import { PageList, UIPageController } from "client/controllers/ui-page.controller";
import { useFlameworkDependency } from "client/ui/hooks/use-flamework-dependency";
import { Hud } from "./hud";
import { useAtom } from "@rbxts/react-charm";
import { AdminController } from "client/controllers/admin.controller";

export function HudWrapper() {
	const pageController = useFlameworkDependency<UIPageController>();
	const adminController = useFlameworkDependency<AdminController>();

	const togglePage = (page: PageList) => pageController.toggle(page);
	const activePage = useAtom(() => pageController.get());
	const hasAdminAccess = useAtom(adminController.hasAccess);

	return <Hud togglePage={togglePage} showAdminButton={hasAdminAccess} enabled={activePage === undefined} />;
}
