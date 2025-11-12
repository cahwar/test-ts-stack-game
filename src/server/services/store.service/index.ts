import { Players } from "@rbxts/services";
import { OnStart, Service } from "@flamework/core";
import { loadPlayer, store, unloadPlayer } from "./store";
import { Data, DataKeys, template } from "shared/store";
import { teleport } from "shared/utils/teleport-utils";

@Service()
export class StoreService implements OnStart {
	onStart() {
		this.hookPlayers();

		game.BindToClose(() => {
			store.closeAsync();
		});
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

	private hookPlayers = () => {
		const playerAdded = (player: Player) => loadPlayer(player);
		const playerRemoving = (player: Player) => unloadPlayer(player);

		Players.GetPlayers().forEach(playerAdded);

		Players.PlayerAdded.Connect(playerAdded);
		Players.PlayerRemoving.Connect(playerRemoving);
	};
}
