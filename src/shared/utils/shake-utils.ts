import { createMotion, TweenOptions } from "@rbxts/ripple";
import { RunService, Workspace } from "@rbxts/services";

export enum ShakeAxis {
	XY = "calculateXY",
	XZ = "calculateXZ",
	XYZ = "calculateXYZ",
}

type ShakeCalculator = (sinWave: number, cosWave: number) => CFrame;

const shakeCalculators: Record<ShakeAxis, ShakeCalculator> = {
	[ShakeAxis.XY]: (sinWave: number, cosWave: number) => CFrame.Angles(sinWave, cosWave, 0),
	[ShakeAxis.XZ]: (sinWave: number, cosWave: number) => CFrame.Angles(sinWave, 0, cosWave),
	[ShakeAxis.XYZ]: (sinWave: number, cosWave: number) => CFrame.Angles(sinWave, cosWave, cosWave),
};

export class CameraShake {
	private previousShakeAngle: CFrame | undefined = undefined;
	private scaleMotion = createMotion(0, { start: true });
	private stepConnection: RBXScriptConnection | undefined = undefined;
	private stopCalled: boolean = false;

	private shakeCalculator: ShakeCalculator;

	constructor(
		shakeAxis: ShakeAxis,
		private readonly sinAngle: number,
		private readonly sinSpeed: number,
		private readonly cosAngle: number,
		private readonly cosSpeed: number,
	) {
		this.shakeCalculator = shakeCalculators[shakeAxis];
	}

	setScale(value: number, options?: TweenOptions): void {
		if (this.stopCalled) return;

		this.scaleMotion.tween(
			value,
			options ?? { time: 0.1, style: Enum.EasingStyle.Quad, direction: Enum.EasingDirection.Out },
		);
	}

	start(options?: TweenOptions): CameraShake {
		this.stepConnection = RunService.Heartbeat.Connect(() => this.step());
		this.setScale(1, options);
		return this;
	}

	stop(options?: TweenOptions): void {
		if (this.stopCalled) return;

		this.scaleMotion.onComplete(() => {
			this.destroy();
		});

		this.setScale(0, options);

		this.stopCalled = true;
	}

	private destroy(): void {
		this.scaleMotion.destroy();
		this.stepConnection?.Disconnect();
	}

	private step(): void {
		if (!Workspace.CurrentCamera) return;

		const sinWave = math.rad(math.sin(tick() * this.sinSpeed) * this.sinAngle) * this.scaleMotion.get();
		const cosWave = math.rad(math.cos(tick() * this.cosSpeed) * this.cosAngle) * this.scaleMotion.get();

		const shakeAngle = this.shakeCalculator(sinWave, cosWave);
		const currentCameraCFrame = Workspace.CurrentCamera.CFrame;

		if (this.previousShakeAngle) {
			const [xRot, yRot, zRot] = this.previousShakeAngle.ToEulerAnglesYXZ();

			Workspace.CurrentCamera.CFrame = currentCameraCFrame.mul(
				shakeAngle.mul(CFrame.Angles(-xRot, -yRot, -zRot)),
			);
		} else {
			Workspace.CurrentCamera.CFrame = currentCameraCFrame.mul(shakeAngle);
		}

		this.previousShakeAngle = shakeAngle;
	}
}
