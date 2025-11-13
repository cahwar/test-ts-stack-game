import { Controller } from "@flamework/core";
import { Players } from "@rbxts/services";
import { sharedAtoms } from "shared/state-sync/atoms";
import { Data, DataKeys } from "shared/store";

@Controller()
export class StoreController {
	private dataKey = tostring(Players.LocalPlayer.UserId);

	getData(): Promise<Data> {
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

	getValue<Key extends DataKeys>(key: Key): Promise<Data[Key]> {
		return this.getData().then((data) => data[key]);
	}
}
