import React from "@rbxts/react";
import { NativeProps, useNativeProps } from "client/ui/hooks/use-native-props";
import { BindedProperty } from "client/ui/types";
import { Stroke } from "../style/stroke";
import { usePx } from "client/ui/hooks/use-px";

interface NativeTextProps extends NativeProps<TextLabel> {
	Text: string;
	TextStrokeTransparency?: BindedProperty<number>;
	MaxVisibleGraphemes?: BindedProperty<number>;
	TextTransparency?: BindedProperty<number>;
	TextColor3?: BindedProperty<Color3>;
	TextXAlignment?: Enum.TextXAlignment;
	TextYAlignment?: Enum.TextYAlignment;
	TextWrap?: boolean;
	TextScaled?: boolean;
	TextSize?: number;
	RichText?: boolean;
	FontWeight?: Enum.FontWeight;
	FontStyle?: Enum.FontStyle;
	Font?: Enum.Font;
}

export interface TextProps extends NativeTextProps {
	strokeSize?: BindedProperty<number>;
	strokeColor?: BindedProperty<Color3>;
	ignoreStroke?: boolean;
}

const TEXT_COLOR = Color3.fromRGB(255, 255, 255);
const FONT = Enum.Font.FredokaOne;

export function Text(props: TextProps) {
	const px = usePx();

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
			TextWrap={props.TextWrap}
			TextSize={props.TextSize}
			RichText={props.RichText}
			FontFace={Font.fromName(
				props.Font?.Name ?? FONT.Name,
				props.FontWeight ?? Enum.FontWeight.Regular,
				props.FontStyle ?? Enum.FontStyle.Normal,
			)}
			Text={props.Text}
		>
			{props.ignoreStroke !== true && <Stroke size={props.strokeSize ?? px(3)} color={props.strokeColor} />}
			{props.children}
		</textlabel>
	);
}
