import React from "@rbxts/react";
import { PageList } from "client/controllers/ui-page.controller";
import { Layer } from "../../composables/layer";
import { Frame } from "../../composables/frame";
import { usePx } from "client/ui/hooks/use-px";
import { AdminButton } from "./admin-button";

export interface HudProps {
	togglePage: (page: PageList) => void;
	showAdminButton: boolean;
	enabled: boolean;
}

export function Hud(props: HudProps) {
	const px = usePx();

	return (
		<Layer>
			<>
				{props.showAdminButton && <AdminButton togglePage={props.togglePage}></AdminButton>}

				<Frame
					Position={new UDim2(0, px(10), 0.5, 0)}
					AnchorPoint={new Vector2(0, 0.5)}
					Size={UDim2.fromScale(0.15, 0.4)}
					BackgroundTransparency={0.5}
				></Frame>
			</>
		</Layer>
	);
}
