import { Controller, Modding, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";

export interface OnCharacterAdded {
	onCharacterAdded(character: Model): void;
}

export interface OnCharacterRemoved {
	onCharacterRemoved(): void;
}

@Controller()
export class CharacterLifecycleController implements OnStart {
	private characterAddedListeners: Set<OnCharacterAdded> = new Set();
	private characterRemovedListeners: Set<OnCharacterRemoved> = new Set();

	public onStart() {
		Modding.onListenerAdded<OnCharacterAdded>((listener) => this.characterAddedListeners.add(listener));
		Modding.onListenerAdded<OnCharacterRemoved>((listener) => this.characterRemovedListeners.add(listener));

		task.spawn(() => {
			this.hookCharacter();

			Players.LocalPlayer.CharacterAdded.Connect(() => {
				this.hookCharacter();
			});

			Players.LocalPlayer.CharacterRemoving.Connect(() => {
				this.characterRemovedListeners.forEach((listener) => listener.onCharacterRemoved());
			});
		});
	}

	private hookCharacter() {
		const character: Model = Players.LocalPlayer.Character || Players.LocalPlayer.CharacterAdded.Wait()[0];
		const humanoid: Humanoid = character.WaitForChild("Humanoid") as Humanoid;

		this.characterAddedListeners.forEach((listener) => listener.onCharacterAdded(character));

		humanoid.Died.Once(() => {
			this.characterRemovedListeners.forEach((listener) => listener.onCharacterRemoved());
		});
	}
}
