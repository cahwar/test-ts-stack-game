import { useBindingListener, useEventListener, useMotion, useMountEffect } from "@rbxts/pretty-react-hooks";
import React, { useBinding, useEffect, useState } from "@rbxts/react";
import { NpcData } from "client/controllers/npc.controller";
import { ProgressBar } from "client/ui/components/composables/progress-bar";
import { Text } from "client/ui/components/composables/text";
import { usePx } from "client/ui/hooks/use-px";
import { springs } from "shared/constants/ui/springs";

export interface NpcDisplayProps {
	data: NpcData;
}

export function NpcDisplay(props: NpcDisplayProps) {
	const px = usePx();

	const [enabled, setEnabled] = useState(true);
	const [scale, scaleRatio] = useMotion(0);
	const [hp, setHp] = useBinding(0);

	useMountEffect(() => {
		setHp(props.data.instance.FindFirstChildWhichIsA("Humanoid")?.Health ?? props.data.config.hp);
	});

	useEventListener(props.data.instance.FindFirstChildWhichIsA("Humanoid")?.HealthChanged, (hp) => {
		setHp(hp);
	});

	useEffect(() => {
		scaleRatio.spring(enabled ? 1 : 0, enabled ? springs.bubbly : springs.default);
	}, [enabled]);

	useBindingListener(hp, (value) => {
		const isAlive = value > 0;

		if (enabled === isAlive) {
			scaleRatio.impulse(0.005);
		}

		setEnabled(isAlive);
	});

	return (
		<billboardgui
			Adornee={props.data.instance.PrimaryPart as BasePart}
			Size={scale.map((value) => UDim2.fromScale(0, 0).Lerp(new UDim2(4.5, px(5), 1.25, px(5)), value))}
			StudsOffsetWorldSpace={new Vector3(0, props.data.instance.GetExtentsSize().Y / 1.5, 0)}
			AlwaysOnTop={false}
			MaxDistance={50}
		>
			<Text
				Text={props.data.config.name}
				Size={UDim2.fromScale(1, 0.35)}
				AnchorPoint={new Vector2(0.5, 0)}
				Position={UDim2.fromScale(0.5, 0)}
				TextScaled={true}
			/>

			<ProgressBar
				Size={UDim2.fromScale(0.9, 0.525)}
				Position={UDim2.fromScale(0.5, 0.975)}
				AnchorPoint={new Vector2(0.5, 1)}
				BackgroundColor3={Color3.fromRGB(60, 60, 60)}
				cornerRadius={new UDim(0, px(16))}
				useStroke={true}
				current={hp}
				goal={props.data.config.hp}
				showProgressText={true}
			/>
		</billboardgui>
	);
}
