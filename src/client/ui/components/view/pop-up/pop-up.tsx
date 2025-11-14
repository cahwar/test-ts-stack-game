import React, { useMemo } from "@rbxts/react";
import { PopUpData } from "client/controllers/pop-up.controller";
import { Frame } from "../../composables/frame";
import { useEffect } from "@rbxts/react";
import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import { springs } from "shared/constants/ui/springs";
import { usePx } from "client/ui/hooks/use-px";
import { Text } from "../../composables/text";

export interface PopUpProps {
	data: PopUpData;
	playSound: () => void;
}

export function PopUp(props: PopUpProps) {
	const px = usePx();
	const [alpha, alphaMotor] = useMotion(0);

	const position = useMemo(() => UDim2.fromScale(math.random(25, 75) / 100, math.random(30, 60) / 100), []);

	useEffect(() => {
		alphaMotor.spring(props.data.visible ? 1 : 0, springs.responsive);
	}, [props.data.visible]);

	useEffect(() => {
		props.playSound();
	}, []);

	return (
		<Frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={lerpBinding(alpha, UDim2.fromScale(position.X.Scale, 1), position)}
			Size={lerpBinding(alpha, UDim2.fromScale(0, 0), UDim2.fromOffset(px(65), px(65)))}
			BackgroundTransparency={1}
		>
			<imagelabel
				Size={UDim2.fromScale(1, 1)}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BorderSizePixel={0}
				BackgroundTransparency={1}
				Image={props.data.icon}
			></imagelabel>

			<Text
				Size={UDim2.fromScale(1, 0.45)}
				Position={UDim2.fromScale(1.35, 1.1)}
				AnchorPoint={new Vector2(1, 1)}
				Text={props.data.text}
				TextScaled={true}
				RichText={true}
				ZIndex={1}
			></Text>
		</Frame>
	);
}
