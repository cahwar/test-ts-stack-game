import { Controller, OnInit } from "@flamework/core";
import { subscribe } from "@rbxts/charm";
import { Players } from "@rbxts/services";
import { PlayerDataElement, PlayerData } from "shared/store/store-shared";
import { sharedAtoms } from "shared/sync/state-sync-shared";

@Controller()
export class StoreController implements OnInit {
	onInit(): void | Promise<void> {
		this.getData().then(warn);

		this.getValue("coins").then((value) => {
			warn(value);

			subscribe(
				() => sharedAtoms.store()[tostring(Players.LocalPlayer.UserId)]!.coins,
				(state) => {
					warn("coins " + state);
				},
			);

			subscribe(
				() => sharedAtoms.store()[tostring(Players.LocalPlayer.UserId)]!.gems,
				(state) => {
					warn("gemsss " + state);
				},
			);
		});
	}

	public getData(): Promise<PlayerData> {
		const playerIndex = tostring(Players.LocalPlayer.UserId);
		let store = sharedAtoms.store();
		let playerData = store[playerIndex];

		if (playerData) {
			return Promise.resolve(playerData);
		}

		return new Promise((resolve) => {
			while (playerData === undefined) {
				store = sharedAtoms.store();
				playerData = store[playerIndex];
				task.wait();
			}

			resolve(playerData);
		});
	}

	public getValue<Key extends PlayerDataElement>(name: Key): Promise<PlayerData[Key]> {
		return this.getData().then((data) => data[name]);
	}
}
