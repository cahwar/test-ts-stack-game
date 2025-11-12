import { TeleportService } from "@rbxts/services";

function getTeleportOptions(data?: unknown, reserveAccessCode?: string) {
	const teleportOptions = new Instance("TeleportOptions");

	if (reserveAccessCode !== undefined) teleportOptions.ReservedServerAccessCode = reserveAccessCode;
	if (data !== undefined) teleportOptions.SetTeleportData(data);

	return teleportOptions;
}

export function teleport(players: Array<Player>, placeId: number, data?: unknown) {
	return new Promise<void>((resolve: () => void, reject: (errorMessage?: string) => void) => {
		const [success, result] = pcall(() => {
			TeleportService.TeleportAsync(placeId, players, getTeleportOptions(data));
		});

		if (success) {
			resolve();
		} else {
			reject(`[Teleport Error] ${result !== undefined ? (result as string) : "Uknown teleportation error"}`);
		}
	});
}

export function teleportPrivateServer(players: Array<Player>, placeId: number, data?: unknown) {
	return new Promise<void>((resolve: () => void, reject: (errorMessage?: string) => void) => {
		const [reserveSuccess, reserveResult] = pcall(() => TeleportService.ReserveServer(placeId));

		if (!reserveSuccess) {
			return reject(
				`[Teleport Error] ${reserveResult !== undefined ? (reserveResult as string) : "Server reserve error"}`,
			);
		}

		const [success, result] = pcall(() =>
			TeleportService.TeleportAsync(placeId, players, getTeleportOptions(data, reserveResult as string)),
		);

		if (!success) {
			return reject(
				`[Teleport Error] ${result !== undefined ? (result as string) : "Uknown teleportation error"}`,
			);
		}

		resolve();
	});
}
