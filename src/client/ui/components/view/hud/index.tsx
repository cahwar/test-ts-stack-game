import React from "@rbxts/react";
import { PageList, UIPageController } from "client/controllers/ui-page.controller";
import { useFlameworkDependency } from "client/ui/hooks/use-flamework-dependency";
import { Hud } from "./hud";
import { useAtom } from "@rbxts/react-charm";
import { AdminController } from "client/controllers/admin.controller";
import { StoreController } from "client/controllers/store.controller";
import { MONEY_ICON, POWER_ICON } from "shared/constants/ui/icons";

export function HudWrapper() {
	const pageController = useFlameworkDependency<UIPageController>();
	const adminController = useFlameworkDependency<AdminController>();
	const storeController = useFlameworkDependency<StoreController>();

	const togglePage = (page: PageList) => pageController.toggle(page);
	const activePage = useAtom(pageController.getSelector());
	const hasAdminAccess = useAtom(adminController.hasAccess);

	const power = useAtom(() => storeController.getValue("power").expect());
	const money = useAtom(() => storeController.getValue("money").expect());

	return (
		<Hud
			togglePage={togglePage}
			showAdminButton={hasAdminAccess}
			enabled={activePage === undefined}
			values={[
				{ value: power, icon: POWER_ICON },
				{ value: money, icon: MONEY_ICON },
			]}
		/>
	);
}
