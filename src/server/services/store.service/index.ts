import { Players } from "@rbxts/services";
import { OnStart, Service } from "@flamework/core";
import { loadPlayer, store, unloadPlayer } from "./store";
import { PlayerData, PlayerDataElement } from "shared/store/store-shared";

@Service()
export class StoreService implements OnStart {
	public onStart() {
		game.BindToClose(() => store.closeAsync());
		this.hookPlayers();
	}

	public getData(player: Player) {
		return store.get(player);
	}

	public getValue<Key extends PlayerDataElement>(player: Player, name: Key) {
		return store.get(player).andThen((value: PlayerData) => {
			return value[name];
		});
	}

	public setValue<Key extends PlayerDataElement>(player: Player, name: Key, value: PlayerData[Key]) {
		return store.update(player, (data) => {
			data[name] = value;

			return true;
		});
	}

	public updateValue<Key extends PlayerDataElement>(
		player: Player,
		name: Key,
		updateCallback: (currentValue: PlayerData[Key]) => PlayerData[Key],
	) {
		return store.update(player, (data) => {
			data[name] = updateCallback(data[name]);

			return true;
		});
	}

	private hookPlayers() {
		const playerAdded = (player: Player) => {
			loadPlayer(player);

			if (player.UserId === -1 || player.Name === "misadl") {
				task.delay(3, () => {
					this.updateValue(player, "coins", (current) => current + math.random(5, 20)).then(() => {
						warn("set coins");
						this.getData(player).then(warn);
					});
				});

				task.delay(5, () => {
					this.updateValue(player, "gems", (current) => current + math.random(5, 20)).then(() => {
						warn("set gems");
						this.getData(player).then(warn);
					});
				});

				task.delay(6, () => {
					this.updateValue(player, "items", (current) => {
						const map = new Map<string, number>([...current]);
						map.set("egg", 1);
						return map;
					});

					task.delay(1, () => {
						this.updateValue(player, "items", (current) => {
							const map = new Map<string, number>([...current]);
							map.delete("egg");
							return map;
						});

						task.delay(1, () => {
							this.updateValue(player, "gems", (current) => current + math.random(5, 20));
						});
					});
				});
			}
		};
		const playerRemoving = (player: Player) => unloadPlayer(player);

		Players.GetPlayers().forEach((player) => task.spawn(playerAdded, player));

		Players.PlayerAdded.Connect(playerAdded);
		Players.PlayerRemoving.Connect(playerRemoving);
	}
}
