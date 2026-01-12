export function measureExecutionSpeed(callback: () => void, prefix?: string) {
	const startTick = tick();
	callback();
	const totalTime = tick() - startTick;
	warn(`${prefix !== undefined ? `[${prefix}]` : ""}Execution speed: ${totalTime}s`);
}
