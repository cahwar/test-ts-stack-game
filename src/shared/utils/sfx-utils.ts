import { Debris, TweenService, Workspace } from "@rbxts/services";

function tweenVolume(sound: Sound, volume: number, tweenInfo: TweenInfo) {
	return new Promise((resolve: (value: unknown) => void) => {
		const tween = TweenService.Create(sound, tweenInfo, { Volume: volume });
		tween.Completed.Once(resolve);
		tween.Play();
	});
}

export function playSound(sound: Sound, parent: Instance = Workspace.CurrentCamera!) {
	const clonedSound = sound.Clone();
	clonedSound.Parent = parent;
	clonedSound.Ended.Once(() => Debris.AddItem(clonedSound, 0));
	clonedSound.Play();
}

export function enableSound(sound: Sound, parent: Instance = Workspace.CurrentCamera!, fadeInDuration?: number) {
	const clonedSound = sound.Clone();
	clonedSound.Parent = parent;

	if (fadeInDuration !== undefined) {
		const originalVolume = clonedSound.Volume;
		clonedSound.Volume = 0;

		clonedSound.Play();

		tweenVolume(
			clonedSound,
			originalVolume,
			new TweenInfo(fadeInDuration, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
		);
	} else {
		clonedSound.Play();
	}

	return (fadeOutDuration?: number) => {
		if (fadeOutDuration === undefined) {
			Debris.AddItem(clonedSound, 0);

			return;
		}

		tweenVolume(
			clonedSound,
			0,
			new TweenInfo(fadeOutDuration, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
		).then(() => Debris.AddItem(clonedSound, 0));
	};
}
