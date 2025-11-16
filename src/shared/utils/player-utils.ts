import { Players, RunService } from "@rbxts/services";
import { isCharacterAlive } from "./character-utils";

export function isPlayerAlive(player?: Player): boolean {
	if (!player) {
		if (RunService.IsClient()) player = Players.LocalPlayer;
		else return false;
	}

	return isCharacterAlive(player.Character);
}

export function onCharacterLoaded(player: Player) {
	return new Promise<void>((resolve: () => unknown, reject: (err?: unknown) => void) => {
		const character = player.Character ?? player.CharacterAdded.Wait()[0];
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const humanoid = character.WaitForChild("Humanoid");
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const rootPart = character.WaitForChild("HumanoidRootPart");

		while (!player.CharacterAppearanceLoaded && player.IsDescendantOf(game)) {
			task.wait();
		}

		if (player.IsDescendantOf(game)) resolve();
		else reject();
	});
}
