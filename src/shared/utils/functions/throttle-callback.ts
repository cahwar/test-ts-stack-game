export function throttleCallback(callback: () => void, time: number) {
	let latestTick = tick();

	return () => {
		if (tick() - latestTick < time) return;

		latestTick = tick();

		callback();
	};
}
