import React, { useMemo } from "@rbxts/react";
import { Frame } from "../../composables/frame";
import { useEffect } from "@rbxts/react";
import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import { springs } from "shared/constants/ui/springs";
import { usePx } from "client/ui/hooks/use-px";
import { Text } from "../../composables/text";
import { FloaterData } from "client/controllers/floater-controller";
import { getPositiveOrNegative } from "shared/utils/functions/get-positive-or-negative";

export interface FloaterProps {
	data: FloaterData;
}

export function Floater(props: FloaterProps) {
	const px = usePx();
	const [alpha, alphaMotor] = useMotion(0);

	const offset = useMemo(
		() => new Vector3(math.random(), math.random(), math.random()).mul(getPositiveOrNegative()).mul(2.5),
		[],
	);

	useEffect(() => {
		alphaMotor.spring(props.data.visible ? 1 : 0, springs.responsive);
	}, [props.data.visible]);

	return (
		<billboardgui
			StudsOffsetWorldSpace={lerpBinding(alpha, new Vector3(), offset)}
			Size={new UDim2(1.4, px(5), 1.4, px(5))}
			Adornee={props.data.adornee as BasePart}
			AlwaysOnTop={true}
			MaxDistance={25}
		>
			<Frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={lerpBinding(alpha, UDim2.fromScale(0, 0), UDim2.fromScale(1, 1))}
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
		</billboardgui>
	);
}
