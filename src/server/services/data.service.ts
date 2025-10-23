import { Service, OnStart } from "@flamework/core";
import { subscribe } from "@rbxts/charm";
import Lyra from "@rbxts/lyra";
import { Players } from "@rbxts/services";
import { t } from "@rbxts/t";
import { PlayerData } from "shared/data.shared";
import { atoms } from "shared/data.shared";
import { type PlayerAtoms } from "shared/data.shared";

const updateAtom = <K extends keyof PlayerData>(atoms: PlayerAtoms, key: K, value: PlayerData[K]) => {
	atoms[key]?.(value);
};

@Service()
export class DataService implements OnStart {
	private store = Lyra.createPlayerStore<PlayerData>({
		name: "data",
		template: { coins: 0, inventory: new Map<string, number>() },
		schema: t.strictInterface({ coins: t.number, inventory: t.map(t.string, t.number) }),
		changedCallbacks: [
			(key, newData) => {
				print(key, newData.coins);

				for (const [k, v] of pairs(newData)) {
					updateAtom(atoms, k, v);
				}
			},
		],
	});

	private threads: Record<number, Record<string, thread> | undefined> = {};

	onStart() {
		subscribe(atoms.coins, (state) => {
			print(`coins: ${state}`);
		});

		const playerAdded = (player: Player) => {
			this.store.loadAsync(player);
			this.threads[player.UserId] = {
				timer: task.spawn(() => {
					while (true) {
						task.wait(1);

						this.setValue(player, "coins", this.getValue(player, "coins") + math.random(10, 15));
					}
				}),
			};
		};

		const playerRemoving = (player: Player) => {
			const playerThreads = this.threads[player.UserId];
			if (playerThreads) {
				for (const [, v] of pairs(playerThreads)) {
					pcall(task.cancel, v);
				}
			}
			this.threads[player.UserId] = undefined;

			warn(this.threads);

			this.store.unloadAsync(player);
		};

		Players.GetPlayers().forEach((player) => task.spawn(playerAdded, player));

		Players.PlayerAdded.Connect(playerAdded);
		Players.PlayerRemoving.Connect(playerRemoving);

		game.BindToClose(() => {
			this.store.closeAsync();
		});
	}

	getValue<T extends keyof PlayerData>(player: Player, name: T): PlayerData[T] {
		const data = this.store.getAsync(player);
		return data[name];
	}

	setValue<T extends keyof PlayerData>(player: Player, name: T, value: PlayerData[T]) {
		this.store.updateAsync(player, (data) => {
			data[name] = value;

			return true;
		});
	}
}
