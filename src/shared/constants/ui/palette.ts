import { brighten } from "shared/utils/color-utils";

export const POSITIVE_COLOR = Color3.fromRGB(143, 245, 143);
export const NEGATIVE_COLOR = Color3.fromRGB(255, 100, 100);
export const DETAIL_COLOR = Color3.fromRGB(255, 150, 50);
export const DAMAGE_COLOR = Color3.fromRGB(255, 100, 100);
export const CRIT_DAMAGE_COLOR = Color3.fromRGB(135, 46, 242);

export const CENTER_HIGHLIGHTED = (color: Color3): ColorSequence =>
	new ColorSequence([
		new ColorSequenceKeypoint(0, color),
		new ColorSequenceKeypoint(0.5, brighten(color, 0.5)),
		new ColorSequenceKeypoint(1, color),
	]);
