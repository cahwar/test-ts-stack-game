import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { MagnetableData } from "client/controllers/magnetable.controller";
import { usePx } from "client/ui/hooks/use-px";
import { springs } from "shared/constants/ui/springs";

export interface MagnetableProps {
	data: MagnetableData;
}

export function Magnetable(props: MagnetableProps) {
	const px = usePx();

	const [scale, scaleMotor] = useMotion(0);

	useEffect(() => {
		scaleMotor.spring(props.data.visible ? 1 : 0, props.data.visible ? springs.bubbly : springs.responsive);
	}, [props.data.visible]);

	return (
		<billboardgui
			Size={lerpBinding(scale, UDim2.fromScale(0, 0), new UDim2(1.5, px(5), 1.5, px(5)))}
			Adornee={props.data.adornee}
			MaxDistance={30}
			AlwaysOnTop={false}
			LightInfluence={0}
		>
			<imagelabel Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1} Image={props.data.icon}></imagelabel>
		</billboardgui>
	);
}
