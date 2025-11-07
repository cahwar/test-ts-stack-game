import { Controller, OnStart } from "@flamework/core";
import { atom, subscribe } from "@rbxts/charm";
import { TweenService, Workspace } from "@rbxts/services";

export interface FovInfo {
	fov: number;
	priority: number;
	tweenInfo: TweenInfo;
}

const DEFAULT_FOV_INFO: FovInfo = {
	fov: 70,
	priority: 0,
	tweenInfo: new TweenInfo(0.15, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
};

@Controller()
export class FovController implements OnStart {
	private fovs = atom<Map<string, FovInfo | undefined>>(new Map([["default", DEFAULT_FOV_INFO]]));

	public onStart(): void {
		subscribe(this.fovs, () => {
			this.update();
		});

		this.update();
	}

	public addFov(name: string, fovInfo: FovInfo): void {
		this.fovs(new Map([...this.fovs(), [name, fovInfo]]));
	}

	public removeFov(name: string): void {
		this.fovs(new Map([...this.fovs(), [name, undefined]]));
	}

	public static getDefaultFov() {
		return DEFAULT_FOV_INFO.fov;
	}

	private getCurrentFov() {
		const fovs = this.fovs();
		let current: FovInfo | undefined = undefined;

		for (const [, v] of pairs(fovs)) {
			if (current === undefined || v.priority > current.priority) {
				current = v;
			}
		}

		return current || DEFAULT_FOV_INFO;
	}

	private update() {
		const current = this.getCurrentFov();

		TweenService.Create(Workspace.CurrentCamera!, current.tweenInfo, { FieldOfView: current.fov }).Play();
	}
}
