import { Events } from "server/network";

export function emitMagnetable(player: Player, origin: Vector3, icon: string, amount: number, radius: number = 5) {
	Events.EmitMagnetable.fire(player, origin, icon, amount, radius);
}
