import React from "@rbxts/react";
import { useBindingListener, useMotion, useThrottleCallback } from "@rbxts/pretty-react-hooks";
import { Text, TextProps } from "./text";
import { useEffect } from "@rbxts/react";
import { getSound } from "shared/utils/asset-utils";
import { playSound } from "shared/utils/sfx-utils";
import { ExcludedProps } from "client/ui/types";
import { useBindedProperty } from "client/ui/hooks/use-binded-property";

const TYPEWRITE_DURATION = 0.4;
const SOUND_THROTTLE_WAIT = 0.1;
const TYPE_SOUND = getSound("Typewrite");

export interface TypewriteTextProps extends TextProps {
	typewriteDuration?: number;
}

export function TypewriteText(props: TypewriteTextProps) {
	const [graphemes, graphemesMotor] = useMotion(0);

	const playSoundThrottled = useThrottleCallback(
		() => {
			playSound(TYPE_SOUND);
		},
		{ wait: SOUND_THROTTLE_WAIT },
	);

	const textProps: ExcludedProps<TextProps, TypewriteTextProps> = { ...props, typewriteDuration: undefined };

	useEffect(() => {
		graphemesMotor.immediate(0);
		graphemesMotor.tween(useBindedProperty(props.Text).size(), {
			time: props.typewriteDuration ?? TYPEWRITE_DURATION,
			style: Enum.EasingStyle.Linear,
		});
	}, [props.Text]);

	useBindingListener(graphemes, (value) => {
		if (value <= 0) return;
		playSoundThrottled.run();
	});

	return <Text {...textProps} MaxVisibleGraphemes={graphemes}></Text>;
}
