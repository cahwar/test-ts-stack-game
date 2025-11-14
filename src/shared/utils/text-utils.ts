export function getColoredString(text: string, color: Color3) {
	return `<font color="#${color.ToHex()}">${text}</font>`;
}

export function getRoundedNumberString(num: number, places: number = 2): string {
	const placesDivisor = math.pow(10, places);

	let numModified = num * placesDivisor;
	numModified = numModified >= 0 ? math.floor(numModified + 0.5) : math.ceil(numModified - 0.5);

	return tostring(numModified / placesDivisor);
}

export function getFormattedNumberString(value: number): string {
	const abs = math.abs(value);
	const sign = value < 0 ? "-" : "";

	if (abs < 1000) return sign + tostring(abs);

	const units = [
		{ limit: 1e12, suffix: "T", divisor: 1e12 },
		{ limit: 1e9, suffix: "B", divisor: 1e9 },
		{ limit: 1e6, suffix: "M", divisor: 1e6 },
		{ limit: 1e3, suffix: "k", divisor: 1e3 },
	];

	let suffix = "";
	let scaled = abs;

	for (const u of units) {
		if (abs >= u.limit) {
			suffix = u.suffix;
			scaled /= u.divisor;

			break;
		}
	}

	return sign + getRoundedNumberString(scaled, 2) + suffix;
}
