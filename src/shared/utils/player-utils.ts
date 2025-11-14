import { Players, RunService } from "@rbxts/services";

export function isAlive(player?: Player): boolean {
	if (!player) {
		if (RunService.IsClient()) player = Players.LocalPlayer;
		else return false;
	}

	const character = player.Character;
	if (character === undefined) return false;

	const humanoid = character.FindFirstChildWhichIsA("Humanoid");
	if (humanoid === undefined || humanoid.GetState() === Enum.HumanoidStateType.Dead) return false;

	return true;
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
