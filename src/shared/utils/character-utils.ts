export function isCharacterAlive(character?: Model): boolean {
	if (!character || character.PrimaryPart === undefined) return false;
	const humanoid = character.FindFirstChildWhichIsA("Humanoid");
	return humanoid !== undefined && humanoid.GetState() !== Enum.HumanoidStateType.Dead;
}
