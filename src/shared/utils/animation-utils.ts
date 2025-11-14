type AnimationLoader = Animator;

export interface AnimationPlayConfig {
	speed?: number;
	looped?: boolean;
	fadeIn?: number;
}

export interface AnimationStopConfig {
	fadeOut?: number;
}

export function loadAnimation(instance: Instance, animation: Animation): AnimationTrack | undefined {
	const animationLoader = (instance.FindFirstChildWhichIsA("AnimationController", true) ||
		instance.FindFirstChildWhichIsA("Animator", true)) as AnimationLoader | undefined;

	if (animationLoader === undefined) return;

	const animationTrack = animationLoader.LoadAnimation(animation);

	return animationTrack;
}
export function playAnimation(instance: Instance, animation: Animation, config: AnimationPlayConfig = {}) {
	const animationTrack = loadAnimation(instance, animation);

	if (animationTrack === undefined) return;

	if (config.speed !== undefined) animationTrack.AdjustSpeed(config.speed);
	if (config.looped !== undefined) animationTrack.Looped = config.looped;
	animationTrack.Play(config.fadeIn);
}

export function stopAnimation(instance: Instance, name: string, config: AnimationStopConfig = {}) {
	const animationLoader = (instance.FindFirstChildWhichIsA("AnimationController", true) ||
		instance.FindFirstChildWhichIsA("Animator", true)) as AnimationLoader | undefined;

	if (animationLoader === undefined) return;

	animationLoader.GetPlayingAnimationTracks().forEach((track) => {
		if (track.Animation?.Name === name) {
			track.Stop(config.fadeOut);
		}
	});
}
