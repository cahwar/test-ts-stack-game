import { Controller } from "@flamework/core";
import { Players } from "@rbxts/services";
import { sharedAtoms } from "shared/state-sync/atoms";
import { Data, DataKeys } from "shared/store";

@Controller()
export class StoreController {
	private dataKey = tostring(Players.LocalPlayer.UserId);

	public getData(): Promise<Data> {
		let data = sharedAtoms.store()[this.dataKey];

		if (data) return Promise.resolve(data);

		return new Promise((resolve: (data: Data) => void) => {
			do {
				data = sharedAtoms.store()[this.dataKey];

				task.wait();
			} while (!data);

			resolve(data);
		});
	}

	public getDataAsync(): Data {
		return this.getData().expect();
	}

	public getValue<Key extends DataKeys>(key: Key) {
		return this.getData().then((data) => data[key]);
	}

	public getValueAsync<Key extends DataKeys>(key: Key) {
		return this.getValue(key).expect();
	}
}
