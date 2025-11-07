import React from "@rbxts/react";
import { InstanceProps, selectInstanceProps } from "client/react/interfaces/instance-props";
import { Property } from "client/react/types";
import { Stroke } from "../style/stroke";

export interface TextProps extends InstanceProps<TextLabel> {
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
	Text?: string;
	StrokeSize?: Property<number>;
	StrokeColor?: Property<Color3>;
}

const TEXT_COLOR = Color3.fromRGB(255, 255, 255);
const FONT = Enum.Font.FredokaOne;

export function Text(props: TextProps) {
	return (
		<textlabel
			BackgroundTransparency={1}
			BorderSizePixel={0}
			{...selectInstanceProps(props)}
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
			{(props.StrokeSize !== undefined || props.StrokeColor !== undefined) && (
				<Stroke Size={props.StrokeSize} Color={props.StrokeColor} />
			)}
			{props.children}
		</textlabel>
	);
}
