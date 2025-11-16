import { Modding, OnStart, Service } from "@flamework/core";
import { OnPlayerJoined } from "./player-lifecycle.service";

export interface OnCharacterAdded {
	onCharacterAdded(player: Player, character: Model): void;
}

export interface OnCharacterRemoved {
	onCharacterRemoved(player: Player): void;
}

@Service()
export class CharacterLifecycleService implements OnStart, OnPlayerJoined, OnCharacterAdded {
	private characterAddedListeners: Set<OnCharacterAdded> = new Set();
	private characterRemovedListeners: Set<OnCharacterRemoved> = new Set();

	onStart(): void {
		Modding.onListenerAdded<OnCharacterAdded>((listener) => this.characterAddedListeners.add(listener));
		Modding.onListenerAdded<OnCharacterRemoved>((listener) => this.characterRemovedListeners.add(listener));
	}

	onPlayerJoined(player: Player): void {
		this.hookCharacter(player);

		player.CharacterAdded.Connect(() => this.hookCharacter(player));
		player.CharacterRemoving.Connect(() => {
			this.characterRemovedListeners.forEach((listener) => listener.onCharacterRemoved(player));
		});
	}

	onCharacterAdded(player: Player, character: Model): void {
		character.AddTag("PlayerCharacter");
	}

	private hookCharacter(player: Player) {
		const character: Model = player.Character || player.CharacterAdded.Wait()[0];
		const humanoid: Humanoid = character.WaitForChild("Humanoid") as Humanoid;

		this.characterAddedListeners.forEach((listener) => listener.onCharacterAdded(player, character));

		humanoid.Died.Once(() => {
			this.characterRemovedListeners.forEach((listener) => listener.onCharacterRemoved(player));
		});
	}
}
