export function isCharacterAlive(character?: Model): boolean {
	if (!character) return false;
	const humanoid = character.FindFirstChildWhichIsA("Humanoid");
	return humanoid !== undefined && humanoid.GetState() !== Enum.HumanoidStateType.Dead;
}
