export function getColoredString(text: string, color: Color3) {
	return `<font color="#${color.ToHex()}">${text}</font>`;
}
