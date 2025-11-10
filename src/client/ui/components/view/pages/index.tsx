import React from "@rbxts/react";
import { PageList } from "client/controllers/ui-page.controller";
import { useAtom } from "@rbxts/react-charm";
import { useFlameworkDependency } from "client/ui/hooks/use-flamework-dependency";
import { UIPageController } from "client/controllers/ui-page.controller";
import { TestPage } from "./pages/test-page";
import { PageActivityProps } from "./page";
import Object from "@rbxts/object-utils";
import { Layer } from "../../composables/layer";

const PAGES: Record<PageList, React.FunctionComponent<PageActivityProps>> = {
	[PageList.test]: TestPage,
	[PageList.notOverrideableTest]: TestPage,
};

export function Pages() {
	const controller = useFlameworkDependency<UIPageController>();
	const activePage = useAtom(controller.getSelector());

	const usePage = (page: PageList) => activePage === page;

	return (
		<Layer>
			{Object.entries(PAGES).map((value) => React.createElement(value[1], { enabled: usePage(value[0]) }))}
		</Layer>
	);
}
