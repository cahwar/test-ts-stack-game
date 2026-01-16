import { OnStart, Service } from "@flamework/core";
import { addListener, loadPlayer, store, unloadPlayer } from "./store";
import { Data, DataKeys, template } from "shared/store";
import { teleport } from "shared/utils/teleport-utils";
import { OnPlayerJoined, OnPlayerRemoving } from "../player-lifecycle.service";
import { attempt } from "shared/utils/functions/attempt";

const DATA_ATTEMPT_TIME = 10;
const DATA_ATTEMPT_PERIOD = 1;

interface Listener<K extends DataKeys = DataKeys> {
	key: K;
	callback: (newValue: Data[K], prevValue?: Data[K]) => void;
}

@Service({ loadOrder: 0 })
export class StoreService implements OnStart, OnPlayerJoined, OnPlayerRemoving {
	private playerListeners = new Map<string, Listener[] | undefined>();

	onStart(): void {
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
	}

	onPlayerRemoving(player: Player): void {
		unloadPlayer(player);

		this.playerListeners.set(tostring(player.UserId), undefined);
	}

	watch<K extends DataKeys>(
		player: Player,
		key: K,
		callback: (newValue: Data[K], prevValue?: Data[K]) => void,
	): () => void {
		this.useValue(player, key, callback);
		const cleanup = this.onChange(player, key, callback);
		return cleanup;
	}

	onChange<K extends DataKeys>(
		player: Player,
		key: K,
		callback: (newValue: Data[K], prevValue?: Data[K]) => void,
	): () => void {
		const userId = tostring(player.UserId);

		const listener: Listener = { key, callback } as Listener;

		if (!this.playerListeners.get(userId) && player.IsDescendantOf(game)) {
			this.playerListeners.set(userId, []);
		}

		this.playerListeners.get(userId)?.push(listener);

		return () => {
			const playerListeners = this.playerListeners.get(userId);
			if (playerListeners === undefined) return;

			const index = playerListeners.indexOf(listener);
			if (index !== undefined) playerListeners.remove(index);
		};
	}

	getData(player: Player): Promise<Data> {
		return attempt<Data>(
			() => store.getAsync(player),
			(err?: unknown) => {
				return (
					player.IsDescendantOf(game) &&
					err !== undefined &&
					typeIs(err, "string") &&
					err.find("Key not loaded")[0] !== undefined
				);
			},
			DATA_ATTEMPT_TIME,
			DATA_ATTEMPT_PERIOD,
		);
	}

	useValue<Key extends DataKeys>(player: Player, key: Key, callback: (value: Data[Key]) => void): void {
		this.getValue(player, key).then((value) => {
			if (value !== undefined) callback(value);
		});
	}

	getValue<Key extends DataKeys>(player: Player, key: Key): Promise<Data[Key] | void> {
		return this.getData(player)
			.then((data: Data) => data[key])
			.catch((err) => warn(err));
	}

	setValue<Key extends DataKeys>(player: Player, key: Key, value: Data[Key]): Promise<boolean | void> {
		return this.updateData(player, (data) => {
			data[key] = value;

			return true;
		}).catch((err) => warn(err));
	}

	updateValue<Key extends DataKeys>(
		player: Player,
		key: Key,
		updateCallback: (value: Data[Key]) => Data[Key],
	): Promise<boolean | void> {
		return this.updateData(player, (data) => {
			data[key] = updateCallback(data[key]);
			return true;
		}).catch((err) => warn(err));
	}

	updateData(player: Player, updateCallback: (value: Data) => boolean): Promise<boolean | void> {
		return attempt<boolean>(
			() => store.updateAsync(player, (data) => updateCallback(data)),
			(err?: unknown) => {
				return (
					player.IsDescendantOf(game) &&
					err !== undefined &&
					typeIs(err, "string") &&
					err.find("Key not loaded")[0] !== undefined
				);
			},
			DATA_ATTEMPT_TIME,
			DATA_ATTEMPT_PERIOD,
		);
	}

	reset(player: Player): void {
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
			})
			.catch((err) => warn(err));
	}
}
