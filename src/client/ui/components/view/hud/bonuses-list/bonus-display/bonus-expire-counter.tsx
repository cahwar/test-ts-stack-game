import { useInterval } from "@rbxts/pretty-react-hooks";
import React, { useBinding } from "@rbxts/react";
import { Text } from "client/ui/components/composables/text";
import { usePx } from "client/ui/hooks/use-px";
import { getTimeStringMS } from "shared/utils/text-utils";

export interface BonusExpireCounterProps {
	startTime: number;
	expiresIn: number;
}

export function BonusExpireCounter({ startTime, expiresIn }: BonusExpireCounterProps) {
	const getTimeLeft = () => math.max(expiresIn - (os.time() - startTime), 0);
	const [timeLeft, setTimeLeft] = useBinding(getTimeLeft());

	const px = usePx();

	useInterval(() => {
		setTimeLeft(getTimeLeft());
	}, 1);

	return (
		<Text
			Text={timeLeft.map((value) => getTimeStringMS(value))}
			Size={UDim2.fromScale(0.75, 0.45)}
			Position={UDim2.fromScale(1, 0)}
			AnchorPoint={new Vector2(1, 0)}
			TextScaled={true}
			TextXAlignment={Enum.TextXAlignment.Right}
			TextYAlignment={Enum.TextYAlignment.Bottom}
			ZIndex={2}
			strokeSize={px(2)}
		/>
	);
}
