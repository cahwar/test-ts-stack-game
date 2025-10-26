import { Modding, OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";

export interface OnPlayerJoined {
	onPlayerJoined(player: Player): void;
}

export interface OnPlayerRemoving {
	onPlayerRemoving(player: Player): void;
}

@Service()
export class PlayerLifecycleService implements OnStart {
	public onStart() {
		const joinListeners = new Set<OnPlayerJoined>();
		const removingListeners = new Set<OnPlayerRemoving>();

		Modding.onListenerAdded<OnPlayerJoined>((value: OnPlayerJoined) => joinListeners.add(value));
		Modding.onListenerAdded<OnPlayerRemoving>((value: OnPlayerRemoving) => removingListeners.add(value));

		Players.GetPlayers().forEach((player) => {
			joinListeners.forEach((listener) => listener.onPlayerJoined(player));
		});

		Players.PlayerAdded.Connect((player) => {
			joinListeners.forEach((listener) => listener.onPlayerJoined(player));
		});

		Players.PlayerRemoving.Connect((player) => {
			removingListeners.forEach((listener) => listener.onPlayerRemoving(player));
		});
	}
}
