import React from "@rbxts/react";
import { PageList } from "client/controllers/ui-page.controller";
import { Layer } from "../../composables/layer";
import { LeftBar } from "./left-bar";

export interface HudRenderProps {
	togglePage: (page: PageList) => void;
}

export function HudRender(props: HudRenderProps) {
	return (
		<Layer IgnoreGuiInset={false}>
			<LeftBar></LeftBar>
		</Layer>
	);
}
