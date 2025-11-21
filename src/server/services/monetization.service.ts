import { OnStart, Service } from "@flamework/core";
import { OnPlayerJoined } from "./player-lifecycle.service";
import { StoreService } from "./store.service";
import { MarketplaceService, Players } from "@rbxts/services";

type PassCallback = (player: Player, firstPurchase: boolean) => void;
type ProductCallback = (player: Player) => void;

@Service()
export class MonetizationService implements OnStart, OnPlayerJoined {
	private passCallbacks = new Map<number, PassCallback[]>();
	private productCallbacks = new Map<number, ProductCallback[]>();

	constructor(private readonly storeService: StoreService) {}

	onStart(): void {
		MarketplaceService.ProcessReceipt = (info) => {
			const player = Players.GetPlayerByUserId(info.PlayerId);
			if (!player) return Enum.ProductPurchaseDecision.NotProcessedYet;

			const callbacks = this.productCallbacks.get(info.ProductId);
			if (!callbacks) return Enum.ProductPurchaseDecision.NotProcessedYet;

			callbacks.forEach((callback) => callback(player));

			return Enum.ProductPurchaseDecision.PurchaseGranted;
		};

		MarketplaceService.PromptGamePassPurchaseFinished.Connect((player, passId, purchased) => {
			if (!purchased) return false;
			if (!player.IsDescendantOf(game)) return false;

			this.storeService.updateValue(player, "passes", (value) => value.set(tostring(passId), true));

			this.passCallbacks.get(passId)?.forEach((callback) => callback(player, true));
		});
	}

	onPlayerJoined(player: Player): void {
		for (const [id, callbacks] of pairs(this.passCallbacks)) {
			task.spawn(() => {
				if (this.hasPass(player, id)) callbacks.forEach((callback) => callback(player, false));
			});
		}
	}

	hasPass(player: Player, id: number): boolean {
		const index = tostring(id);

		const ownedPasses = this.storeService.getValue(player, "passes").expect();
		if (ownedPasses && ownedPasses.has(index)) return true;

		let result = false;

		try {
			result = MarketplaceService.UserOwnsGamePassAsync(player.UserId, id);
			if (result) this.storeService.updateValue(player, "passes", (value) => value.set(index, true));
		} catch (err) {
			warn(err);
		}

		return result;
	}

	addPassCallback(id: number, callback: PassCallback): void {
		const index = id;

		if (!this.passCallbacks.get(index)) this.passCallbacks.set(index, []);
		this.passCallbacks.get(index)?.push(callback);
	}

	addProductCallback(id: number, callback: ProductCallback): void {
		const index = id;

		if (!this.productCallbacks.get(index)) this.productCallbacks.set(index, []);
		this.productCallbacks.get(index)?.push(callback);
	}
}
