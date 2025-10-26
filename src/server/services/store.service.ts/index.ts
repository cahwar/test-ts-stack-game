import { Players } from "@rbxts/services";
import { OnStart, Service } from "@flamework/core";
import { loadPlayer, store, unloadPlayer } from "./store";
import { Data, DataKeys } from "shared/store";

@Service()
export class StoreService implements OnStart {
	public onStart() {
		this.hookPlayers();

		game.BindToClose(() => {
			store.closeAsync();
		});
	}

	public getData(player: Player) {
		return store.get(player);
	}

	public getDataAsync(player: Player) {
		return this.getData(player).expect();
	}

	public getValue<Key extends DataKeys>(player: Player, key: Key) {
		return this.getData(player).then((data: Data) => data[key]);
	}

	public getValueAsync<Key extends DataKeys>(player: Player, key: Key) {
		return this.getValue(player, key).expect();
	}

	public setValue<Key extends DataKeys>(player: Player, key: Key, value: Data[Key]) {
		return store.update(player, (data) => {
			data[key] = value;

			return true;
		});
	}

	public setValueAsync<Key extends DataKeys>(player: Player, key: Key, value: Data[Key]) {
		return this.setValue(player, key, value).expect();
	}
	public updateValue<Key extends DataKeys>(
		player: Player,
		key: Key,
		updateCallback: (value: Data[Key]) => Data[Key],
	) {
		return store.update(player, (data) => {
			data[key] = updateCallback(data[key]);
			return true;
		});
	}

	public updateValueAsync<Key extends DataKeys>(
		player: Player,
		key: Key,
		updateCallback: (value: Data[Key]) => Data[Key],
	) {
		return this.updateValue(player, key, updateCallback).expect();
	}

	private hookPlayers = () => {
		const playerAdded = (player: Player) => loadPlayer(player);
		const playerRemoving = (player: Player) => unloadPlayer(player);

		Players.GetPlayers().forEach(playerAdded);

		Players.PlayerAdded.Connect(playerAdded);
		Players.PlayerRemoving.Connect(playerRemoving);
	};
}
