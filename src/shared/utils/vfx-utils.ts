import { atom, subscribe } from "@rbxts/charm";
import { Debris, TweenService } from "@rbxts/services";

function iterateVfx(vfx: Attachment | ParticleEmitter, callback: (particleEmitter: ParticleEmitter) => void) {
	if (vfx.IsA("ParticleEmitter")) {
		callback(vfx);

		return;
	}

	vfx.GetChildren().forEach((child: Instance) => {
		callback(child as ParticleEmitter);
	});
}

function emit(particleEmitter: ParticleEmitter, parent: Instance, amount: number) {
	const clonedEmitter = particleEmitter.Clone() as ParticleEmitter;
	clonedEmitter.Parent = parent;
	clonedEmitter.Emit(amount);

	Debris.AddItem(clonedEmitter, clonedEmitter.Lifetime.Max);
}

export function emitParticles(vfx: Attachment | ParticleEmitter, parent: Instance, amount: number) {
	iterateVfx(vfx, (particleEmitter: ParticleEmitter) => emit(particleEmitter, parent, amount));
}

export function emitParticlesFromAttributes(
	vfx: Attachment | ParticleEmitter,
	parent: Instance,
	defaultAmount: number = 1,
) {
	iterateVfx(vfx, (particleEmitter: ParticleEmitter) =>
		emit(particleEmitter, parent, (particleEmitter.GetAttribute("Amount") as number) ?? defaultAmount),
	);
}

export function enableParticles(vfx: Attachment | ParticleEmitter, parent: Instance) {
	const particleEmitters: Array<ParticleEmitter> = [];

	iterateVfx(vfx, (particleEmitter: ParticleEmitter) => {
		const clonedEmitter = particleEmitter.Clone();
		clonedEmitter.Parent = parent;
		clonedEmitter.Enabled = true;
		particleEmitters.push(clonedEmitter);
	});

	const enabled = atom(true);

	const disconnect = subscribe(enabled, (state) =>
		particleEmitters.forEach((particleEmitter: ParticleEmitter) => (particleEmitter.Enabled = state)),
	);

	const cleanup = () => {
		enabled(false);

		disconnect();

		particleEmitters.forEach((particleEmitter: ParticleEmitter) => {
			Debris.AddItem(particleEmitter, particleEmitter.Lifetime.Max);
		});
	};

	return { cleanup, enabled };
}

export function flashHighlight(
	parent: Instance,
	title: string = "HighlightEffect",
	time: number = 0.15,
	outlineColor?: Color3,
	fillColor?: Color3,
	outlineTransparency?: number,
	fillTransparency?: number,
) {
	const existingHighlight = parent.FindFirstChild(title);
	if (existingHighlight) Debris.AddItem(existingHighlight, 0);

	const highlight = new Instance("Highlight");
	highlight.DepthMode = Enum.HighlightDepthMode.Occluded;
	highlight.OutlineColor = outlineColor ?? Color3.fromRGB(0, 0, 0);
	highlight.FillColor = fillColor ?? Color3.fromRGB(255, 70, 73);
	highlight.OutlineTransparency = 1;
	highlight.FillTransparency = 1;
	highlight.Parent = parent;

	const tween = TweenService.Create(
		highlight,
		new TweenInfo(time, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, true),
		{ FillTransparency: fillTransparency ?? 0.5, OutlineTransparency: outlineTransparency ?? 0.5 },
	);

	tween.Completed.Once(() => Debris.AddItem(highlight, 0));

	tween.Play();
}
