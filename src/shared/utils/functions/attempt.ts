export function attempt<T = undefined>(
	callback: () => T,
	shouldTry?: (err?: unknown) => boolean,
	time: number = 1.5,
	periods: number = 0.5,
): Promise<T> {
	return new Promise<T>((resolve: (value: T) => void, reject: (err?: unknown) => void) => {
		let [success, result] = pcall(() => callback());

		if (!success) {
			if (shouldTry && !shouldTry(result)) return reject(result);

			const initTick = tick();

			while (!success && tick() - initTick < time) {
				if (shouldTry && !shouldTry(result)) break;

				[success, result] = pcall(() => callback());

				task.wait(periods);
			}

			if (!success) return reject(result);
		}

		resolve(result as T);
	});
}
