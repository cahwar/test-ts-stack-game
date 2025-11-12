import { OnInit, Service } from "@flamework/core";
import { OnPlayerJoined, OnPlayerRemoving } from "./player-lifecycle.service";
import { atom } from "@rbxts/charm";
import { Events } from "server/network";
import { StoreService } from "./store.service";

@Service()
export class ClickService implements OnInit, OnPlayerJoined, OnPlayerRemoving {
	private latestClickTicks = atom<Record<string, number | undefined>>({});
	private cooldown: number = (script.GetAttribute("Cooldown") as number) ?? 0.3;

	constructor(private readonly storeService: StoreService) {}

	public onInit() {
		Events.Click.connect((player) => {
			if (this.isOnCooldown(player)) return;
			this.click(player);
		});
	}

	public onPlayerJoined(player: Player): void {
		this.latestClickTicks((state) => ({
			...state,
			[tostring(player.UserId)]: 0,
		}));
	}

	public onPlayerRemoving(player: Player): void {
		this.latestClickTicks((state) => ({
			...state,
			[tostring(player.UserId)]: undefined,
		}));
	}

	private isOnCooldown(player: Player) {
		const latestTick = this.latestClickTicks()[tostring(player.UserId)] ?? 0;
		return tick() - latestTick < this.cooldown;
	}

	private setLatestTick(player: Player) {
		this.latestClickTicks((currentState) => ({ ...currentState, [tostring(player.UserId)]: tick() }));
	}

	private click(player: Player) {
		this.setLatestTick(player);
		this.storeService.updateValue(player, "coins", (currentCoins) => currentCoins + math.random(3, 5));
	}
}
