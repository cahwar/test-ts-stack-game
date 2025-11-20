import React, { useEffect } from "@rbxts/react";
import { PageList } from "client/controllers/ui-page.controller";
import { Layer } from "../../composables/layer";
import { Frame } from "../../composables/frame";
import { usePx } from "client/ui/hooks/use-px";
import { AdminButton } from "./admin-button";
import { ValueDisplay } from "./value-display";
import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import { springs } from "shared/constants/ui/springs";
import { AutoClickerButton } from "./auto-clicker-button";

export interface HudProps {
	togglePage: (page: PageList) => void;
	autoClicker: { toggle: () => void; isActive: boolean };
	currencyValues: Array<{ value: number; icon: string }>;
	showAdminButton: boolean;
	enabled: boolean;
}

export function Hud(props: HudProps) {
	const px = usePx();

	const [alpha, alphaMotor] = useMotion(0);

	useEffect(() => {
		alphaMotor.spring(props.enabled ? 1 : 0, springs.responsive);
	}, [props.enabled]);

	return (
		<Layer>
			<>
				{props.showAdminButton && <AdminButton togglePage={props.togglePage}></AdminButton>}

				<Frame
					Position={lerpBinding(alpha, UDim2.fromScale(-1, 0.5), new UDim2(0, px(10), 0.5, 0))}
					AnchorPoint={new Vector2(0, 0.5)}
					Size={UDim2.fromScale(0.15, 0.4)}
					BackgroundTransparency={0.5}
				>
					<uilistlayout
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Top}
						Padding={new UDim(0, px(15))}
					/>

					{props.currencyValues.map((data) => (
						<ValueDisplay value={data.value} icon={data.icon}></ValueDisplay>
					))}
				</Frame>

				<Frame
					Position={lerpBinding(alpha, UDim2.fromScale(2, 0.5), new UDim2(1, px(-10), 0.5, 0))}
					AnchorPoint={new Vector2(1, 0.5)}
					Size={UDim2.fromScale(0.15, 0.4)}
					BackgroundTransparency={0.5}
				>
					<uilistlayout
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Top}
						Padding={new UDim(0, px(15))}
					/>

					<AutoClickerButton isActive={props.autoClicker.isActive} toggle={props.autoClicker.toggle} />
				</Frame>
			</>
		</Layer>
	);
}
