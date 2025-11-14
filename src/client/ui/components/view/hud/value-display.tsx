import React, { useEffect } from "@rbxts/react";
import { Frame } from "../../composables/frame";
import { Text } from "../../composables/text";
import { usePx } from "client/ui/hooks/use-px";
import { getFormattedNumberString } from "shared/utils/text-utils";
import { lerpBinding, useBindingState, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { springs } from "shared/constants/ui/springs";

export interface ValueDisplayProps {
	value: number;
	icon: string;
	textColor?: Color3;
}

export function ValueDisplay(props: ValueDisplayProps) {
	const px = usePx();

	const [value, valueMotor] = useMotion(props.value);
	const [scale, scaleMotor] = useMotion(1);

	useEffect(() => {
		valueMotor.tween(props.value, { time: 0.5 });
	}, [props.value]);

	useUpdateEffect(() => {
		scaleMotor.spring(1, springs.bubbly);
		scaleMotor.impulse(0.005);
	}, [props.value]);

	return (
		<Frame
			Size={lerpBinding(scale, UDim2.fromScale(0, 0), UDim2.fromScale(1, 0.2))}
			AnchorPoint={new Vector2(0.5, 0.5)}
			LayoutOrder={0}
			BackgroundTransparency={1}
		>
			<uilistlayout
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				FillDirection={Enum.FillDirection.Horizontal}
				Padding={new UDim(0, px(1))}
			></uilistlayout>

			<imagelabel
				Size={UDim2.fromScale(1, 1)}
				SizeConstraint={Enum.SizeConstraint.RelativeYY}
				BorderSizePixel={0}
				Image={props.icon}
				BackgroundTransparency={1}
			></imagelabel>

			<Text
				Size={UDim2.fromScale(0.4, 0.6)}
				Text={getFormattedNumberString(math.floor(useBindingState(value)))}
				TextColor3={props.textColor}
				TextScaled={true}
			></Text>
		</Frame>
	);
}
