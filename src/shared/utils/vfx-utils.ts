import { atom, subscribe } from "@rbxts/charm";
import { Debris } from "@rbxts/services";

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
	defaultAmount: number = 0,
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
