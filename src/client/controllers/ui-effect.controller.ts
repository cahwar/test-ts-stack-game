import { Controller, OnRender, OnStart } from "@flamework/core";
import { PageList, UIPageController } from "./ui-page.controller";
import { subscribe } from "@rbxts/charm";
import { createMotion } from "@rbxts/ripple";
import { Workspace } from "@rbxts/services";
import { FovController } from "./fov.controller";
import { springs } from "shared/constants/ui/springs";

@Controller()
export class UIEffectController implements OnStart {
	private alphaMotion = createMotion(0, { start: true });

	constructor(
		private readonly pageController: UIPageController,
		private readonly fovController: FovController,
	) {}

	onStart(): void {
		const blur = new Instance("BlurEffect");
		blur.Size = 0;
		blur.Parent = Workspace.CurrentCamera;

		const fade = new Instance("ColorCorrectionEffect");
		fade.Parent = Workspace.CurrentCamera;

		this.alphaMotion.onStep((value) => {
			blur.Size = math.lerp(0, 10, value);
			fade.TintColor = Color3.fromRGB(255, 255, 255).Lerp(Color3.fromRGB(90, 90, 90), value);
		});

		subscribe(this.pageController.getSelector(), (page: PageList | undefined) => {
			if (page !== undefined) this.enablePageEffect();
			else this.disablePageEffect();
		});
	}

	private enablePageEffect() {
		this.alphaMotion.spring(1, springs.responsive);

		this.fovController.addFov("ui-page", {
			fov: FovController.getDefaultFov() - 15,
			tweenInfo: new TweenInfo(0.15, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
			priority: 2,
		});
	}

	private disablePageEffect() {
		this.alphaMotion.spring(0, springs.responsive);

		this.fovController.removeFov("ui-page");
	}
}
