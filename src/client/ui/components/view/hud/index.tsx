import React from "@rbxts/react";
import { PageList, UIPageController } from "client/controllers/ui-page.controller";
import { useFlameworkDependency } from "client/ui/hooks/use-flamework-dependency";
import { Hud } from "./hud";
import { useAtom } from "@rbxts/react-charm";
import { AdminController } from "client/controllers/admin.controller";
import { StoreController } from "client/controllers/store.controller";
import { GEMS_ICON, MONEY_ICON, POWER_ICON } from "shared/constants/ui/icons";
import { AutoClickController } from "client/controllers/auto-click.controller";
import { BonusController } from "client/controllers/bonus.controller";

export function HudWrapper() {
	const pageController = useFlameworkDependency<UIPageController>();
	const adminController = useFlameworkDependency<AdminController>();
	const storeController = useFlameworkDependency<StoreController>();
	const autoClickController = useFlameworkDependency<AutoClickController>();
	const bonusController = useFlameworkDependency<BonusController>();

	const togglePage = (page: PageList) => pageController.toggle(page);
	const toggleAutoClick = () => autoClickController.toggle();

	const activePage = useAtom(pageController.getSelector());
	const hasAdminAccess = useAtom(adminController.hasAccess);
	const isAutoClickActive = useAtom(() => autoClickController.getIsActive());

	const power = useAtom(() => storeController.getValue("power").expect());
	const money = useAtom(() => storeController.getValue("money").expect());
	const gems = useAtom(() => storeController.getValue("gems").expect());

	const bonusesData = useAtom(() => bonusController.getBonuses());

	return (
		<Hud
			togglePage={togglePage}
			autoClicker={{ toggle: toggleAutoClick, isActive: isAutoClickActive }}
			showAdminButton={hasAdminAccess}
			enabled={activePage === undefined}
			currencyValues={[
				{ value: power, icon: POWER_ICON },
				{ value: money, icon: MONEY_ICON },
				{ value: gems, icon: GEMS_ICON },
			]}
			bonusesData={bonusesData}
		/>
	);
}
