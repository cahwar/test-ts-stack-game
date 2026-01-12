import React, { useBinding } from "@rbxts/react";
import { Frame } from "client/ui/components/composables/frame";
import { lerpBinding, useEventListener, useMotion } from "@rbxts/pretty-react-hooks";
import { useEffect } from "@rbxts/react";
import { BonusData } from "shared/interfaces/bonus.interface";
import { RunService, UserInputService } from "@rbxts/services";
import { usePx } from "client/ui/hooks/use-px";
import { BONUS_ICON } from "shared/constants/ui/icons";
import { Text } from "client/ui/components/composables/text";
import { getColoredString } from "shared/utils/text-utils";
import { DETAIL_COLOR } from "shared/constants/ui/palette";

const SIZE_X = 150;
const SIZE_Y = SIZE_X / 2;

export interface BonusTooltipProps {
	enabled: boolean;
	bonusData?: BonusData;
}

export function BonusTooltip(props: BonusTooltipProps) {
	const px = usePx();

	const [alpha, alphaMotor] = useMotion(1);
	const [mouseLocation, setMouseLocation] = useBinding(new Vector2(0, 0));

	const enabled = props.enabled && props.bonusData !== undefined;

	useEffect(() => {
		alphaMotor.tween(enabled ? 1 : 0, {
			time: 0.125,
			style: Enum.EasingStyle.Quad,
			direction: Enum.EasingDirection.Out,
		});
	}, [enabled]);

	useEventListener(
		RunService.Heartbeat,
		() => {
			setMouseLocation(UserInputService.GetMouseLocation());
		},
		{ connected: enabled },
	);

	return (
		<Frame
			Size={lerpBinding(alpha, UDim2.fromOffset(0, 0), UDim2.fromOffset(px(SIZE_X), px(SIZE_Y)))}
			Position={mouseLocation.map((value) =>
				UDim2.fromOffset(value.X + px(SIZE_X / 1.9), value.Y - px(SIZE_Y / 1.5)),
			)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={0.5}
			BackgroundColor3={Color3.fromRGB(252, 191, 128)}
			ZIndex={0}
			Visible={alpha.map((value) => value > 0)}
			cornerRadius={new UDim(0, px(8))}
			useStroke={true}
		>
			<Frame
				Size={UDim2.fromScale(1, 0.4)}
				Position={UDim2.fromScale(0.5, 0)}
				AnchorPoint={new Vector2(0.5, 0)}
				cornerRadius={new UDim(0, px(8))}
				BackgroundTransparency={1}
			>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0, px(10))}
				/>

				<imagelabel
					Size={UDim2.fromScale(0.9, 0.9)}
					SizeConstraint={Enum.SizeConstraint.RelativeYY}
					Position={UDim2.fromScale(0.2, 0.5)}
					AnchorPoint={new Vector2(0, 0.5)}
					Image={props.bonusData?.icon ?? BONUS_ICON}
					BorderSizePixel={0}
					BackgroundTransparency={1}
				/>

				<Text
					Text={props.bonusData?.displayName ?? props.bonusData?.bonusName ?? ""}
					TextScaled={true}
					Size={UDim2.fromScale(0.6, 0.9)}
				/>
			</Frame>

			<Frame
				Size={UDim2.fromScale(1, 0.03)}
				Position={UDim2.fromScale(0.5, 0.4)}
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
			/>

			<Frame
				Size={UDim2.fromScale(1, 0.6)}
				Position={UDim2.fromScale(0.5, 1)}
				AnchorPoint={new Vector2(0.5, 1)}
				cornerRadius={new UDim(0, px(8))}
				BackgroundTransparency={1}
			>
				<Text
					Text={
						props.bonusData
							? (props.bonusData.description ??
								`${getColoredString(props.bonusData.bonusName, DETAIL_COLOR)} Bonus`)
							: ""
					}
					TextScaled={true}
					Size={UDim2.fromScale(0.8, 0.8)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					RichText={true}
				/>
			</Frame>
		</Frame>
	);
}
