import { OnStart, Service } from "@flamework/core";
import { addListener, loadPlayer, store, unloadPlayer } from "./store";
import { Data, DataKeys, template } from "shared/store";
import { teleport } from "shared/utils/teleport-utils";
import { OnPlayerJoined, OnPlayerRemoving } from "../player-lifecycle.service";

interface Listener<K extends DataKeys = DataKeys> {
	key: K;
	callback: (newValue: Data[K], prevValue?: Data[K]) => void;
}

@Service()
export class StoreService implements OnStart, OnPlayerJoined, OnPlayerRemoving {
	private playerListeners = new Map<string, Listener[] | undefined>();

	onStart() {
		game.BindToClose(() => {
			store.closeAsync();
		});

		addListener((userId, newData, oldData?) => {
			if (!oldData) return;

			this.playerListeners.get(userId)?.forEach((listener) => {
				const key = listener.key;

				if (oldData[key] !== newData[key]) {
					listener.callback(newData[listener.key], oldData[listener.key]);
				}
			});
		});
	}

	onPlayerJoined(player: Player): void {
		loadPlayer(player);

		this.playerListeners.set(tostring(player.UserId), []);
	}

	onPlayerRemoving(player: Player): void {
		unloadPlayer(player);

		this.playerListeners.set(tostring(player.UserId), undefined);
	}

	onChange<K extends DataKeys>(player: Player, key: K, callback: (newValue: Data[K], prevValue?: Data[K]) => void) {
		const listener: Listener = { key, callback } as Listener;
		this.playerListeners.get(tostring(player.UserId))?.push(listener);
	}

	getData(player: Player) {
		return store.get(player);
	}

	getValue<Key extends DataKeys>(player: Player, key: Key) {
		return this.getData(player).then((data: Data) => data[key]);
	}

	setValue<Key extends DataKeys>(player: Player, key: Key, value: Data[Key]) {
		return store.update(player, (data) => {
			data[key] = value;

			return true;
		});
	}

	updateValue<Key extends DataKeys>(player: Player, key: Key, updateCallback: (value: Data[Key]) => Data[Key]) {
		return store.update(player, (data) => {
			data[key] = updateCallback(data[key]);
			return true;
		});
	}

	reset(player: Player) {
		const set = <Key extends DataKeys>(data: Data, k: Key, v: Data[Key]) => {
			data[k] = v;
		};

		store
			.update(player, (data: Data) => {
				for (const [name, value] of pairs(template)) {
					set(data, name, value);
				}

				return true;
			})
			.then(() => {
				teleport([player], game.PlaceId).catch((err: unknown) => {
					warn(tostring(err));
				});
			});
	}
}
