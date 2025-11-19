import React, { useBinding, useEffect, useState } from "@rbxts/react";
import { NpcData } from "client/controllers/npc.controller";
import { ProgressBar } from "client/ui/components/composables/progress-bar";
import { Text } from "client/ui/components/composables/text";
import { usePx } from "client/ui/hooks/use-px";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import { AnimatedFrame } from "client/ui/components/composables/animated-frame";

export interface BossStatusProps {
	data?: NpcData;
}

export function BossFrame(props: BossStatusProps) {
	const px = usePx();

	const [enabled, setEnabled] = useState(false);
	const [hp, setHp] = useBinding(0);

	useEffect(() => {
		setEnabled(props.data !== undefined);
	}, [props.data]);

	useEffect(() => {
		setHp(props.data?.instance?.FindFirstChildWhichIsA("Humanoid")?.Health ?? 0);
	}, [props.data]);

	useEventListener(props.data?.instance?.FindFirstChildWhichIsA("Humanoid")?.HealthChanged, (value) => setHp(value));

	return (
		<AnimatedFrame
			Size={UDim2.fromOffset(px(350), px(70))}
			Position={new UDim2(0.5, 0, 0, px(30))}
			AnchorPoint={new Vector2(0.5, 0)}
			BackgroundTransparency={1}
			unmountedPosition={UDim2.fromScale(0.5, -1.5)}
			enabled={enabled}
		>
			<Text
				Text={"Boss"}
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
				goal={props.data?.config.hp ?? 0}
				showProgressText={true}
				fillerColor={Color3.fromRGB(250, 59, 64)}
			/>
		</AnimatedFrame>
	);
}
