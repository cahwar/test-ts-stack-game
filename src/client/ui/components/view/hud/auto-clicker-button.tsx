import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { CLICK_ICON } from "shared/constants/ui/icons";
import { AnimatedButton } from "../../composables/animated-button";
import { HoverTilt } from "../../composables/hover-tilt";
import { Text } from "../../composables/text";
import { CenterHighlightGradient } from "../../style/center-highlight-gradient";
import { springs } from "shared/constants/ui/springs";
import { usePx } from "client/ui/hooks/use-px";

export interface AutoClickerButtonProps {
	isActive: boolean;
	toggle: () => void;
}

export function AutoClickerButton(props: AutoClickerButtonProps) {
	const px = usePx();

	const [colorAlpha, colorAlphaMotor] = useMotion(0);
	const [scaleAlpha, scaleAlphaMotor] = useMotion(1);

	useEffect(() => {
		colorAlphaMotor.tween(props.isActive ? 1 : 0, {
			time: 0.15,
			style: Enum.EasingStyle.Quad,
			direction: Enum.EasingDirection.Out,
		});
	}, [props.isActive]);

	useEffect(() => {
		scaleAlphaMotor.spring(1, springs.bubbly);
		scaleAlphaMotor.impulse(0.005);
	}, [props.isActive]);

	return (
		<AnimatedButton
			Size={lerpBinding(scaleAlpha, UDim2.fromScale(0, 0), UDim2.fromScale(0.35, 0.35))}
			AnchorPoint={new Vector2(0.5, 0.5)}
			SizeConstraint={Enum.SizeConstraint.RelativeXX}
			onMouseClick={() => props.toggle()}
			cornerRadius={new UDim(0, px(16))}
			useStroke={true}
			strokeSize={px(5)}
		>
			<CenterHighlightGradient
				color={lerpBinding(colorAlpha, Color3.fromRGB(10, 156, 255), Color3.fromRGB(168, 250, 102))}
			/>

			<HoverTilt
				Size={UDim2.fromScale(0.75, 0.75)}
				Position={UDim2.fromScale(0.5, 0.05)}
				AnchorPoint={new Vector2(0.5, 0)}
				useButtonContext={true}
			>
				<imagelabel Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1} Image={CLICK_ICON} />
			</HoverTilt>

			<Text
				Size={UDim2.fromScale(1, 0.4)}
				Position={UDim2.fromScale(0.5, 1.1)}
				AnchorPoint={new Vector2(0.5, 1)}
				TextScaled={true}
				Text={"Auto"}
			/>
		</AnimatedButton>
	);
}
