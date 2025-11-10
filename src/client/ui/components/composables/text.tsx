import React from "@rbxts/react";
import { NativeProps, useNativeProps } from "client/ui/hooks/use-native-props";
import { Property } from "client/ui/types";
import { Stroke } from "../style/stroke";

interface NativeTextProps extends NativeProps<TextLabel> {
	Text: string;
	TextStrokeTransparency?: Property<number>;
	MaxVisibleGraphemes?: Property<number>;
	TextTransparency?: Property<number>;
	TextColor3?: Property<Color3>;
	TextXAlignment?: Enum.TextXAlignment;
	TextYAlignment?: Enum.TextYAlignment;
	TextScaled?: boolean;
	TextSize?: number;
	RichText?: boolean;
	FontWeight?: Enum.FontWeight;
	FontStyle?: Enum.FontStyle;
	Font?: Enum.Font;
}

export interface TextProps extends NativeTextProps {
	strokeSize?: Property<number>;
	strokeColor?: Property<Color3>;
	useStroke?: boolean;
}

const TEXT_COLOR = Color3.fromRGB(255, 255, 255);
const FONT = Enum.Font.FredokaOne;

export function Text(props: TextProps) {
	const nativeProps = useNativeProps(props);

	return (
		<textlabel
			BackgroundTransparency={1}
			BorderSizePixel={0}
			{...nativeProps}
			TextStrokeTransparency={props.TextStrokeTransparency ?? 1}
			MaxVisibleGraphemes={props.MaxVisibleGraphemes}
			TextXAlignment={props.TextXAlignment}
			TextYAlignment={props.TextYAlignment}
			TextColor3={props.TextColor3 ?? TEXT_COLOR}
			TextScaled={props.TextScaled}
			TextSize={props.TextSize}
			RichText={props.RichText}
			FontFace={Font.fromName(
				props.Font?.Name ?? FONT.Name,
				props.FontWeight ?? Enum.FontWeight.Regular,
				props.FontStyle ?? Enum.FontStyle.Normal,
			)}
			Text={props.Text}
		>
			{props.useStroke && <Stroke size={props.strokeSize ?? 2} color={props.strokeColor} />}
			{props.children}
		</textlabel>
	);
}
