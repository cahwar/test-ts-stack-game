// Dominance ratio defines which segment of the bezier curve will be at the top. By default, it's middle part

export function getBezier(
	origin: Vector3,
	goal: Vector3,
	alpha: number,
	dominanceRatio: number = 0.5,
	topOffset: number = 5,
) {
	const between = origin.Lerp(goal, dominanceRatio).add(new Vector3(0, topOffset, 0));

	const firstIntersection = origin.Lerp(between, alpha);
	const secondIntersection = between.Lerp(goal, alpha);

	return firstIntersection.Lerp(secondIntersection, alpha);
}
