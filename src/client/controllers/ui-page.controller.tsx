import { Controller } from "@flamework/core";
import { atom, peek } from "@rbxts/charm";

export enum PageList {
	test = "test",
	notOverrideableTest = "notOverriableTest",
}

const NOT_OVERRIDEABLE: Array<PageList> = [PageList.notOverrideableTest];

@Controller()
export class UIPageController {
	private page = atom<PageList | undefined>();

	toggle(page: PageList) {
		if (this.get() === page) this.clear();
		else this.set(page);
	}

	set(page: PageList) {
		const current = this.get();
		if (current !== undefined && NOT_OVERRIDEABLE.includes(current)) return;
		this.page(page);
	}

	getSelector() {
		return () => this.page();
	}

	get() {
		return peek(this.page);
	}

	clear() {
		this.page(undefined);
	}
}
