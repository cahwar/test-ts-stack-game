import { OnInit, Service } from "@flamework/core";
import { RunService } from "@rbxts/services";
import { Events, Functions } from "server/network";
import { OnPlayerRemoving } from "./player-lifecycle.service";
import { StoreService } from "./store.service";

const GROUP_ID = 1;
const ROLES = ["Admin", "Developer", "Coder", "Owner", "Tester"];
const NAMES = ["misadl", "joradl123"];

@Service()
export class AdminService implements OnInit, OnPlayerRemoving {
	private commands = new Map<string, (player: Player) => void>();
	private cachedAccess = new Map<Player, boolean | undefined>();

	constructor(private readonly storeService: StoreService) {}

	onInit(): void | Promise<void> {
		Events.Admin.ProcessCommand.connect((player: Player, name: string) => {
			if (this.hasAccess(player)) this.processCommand(name, player);
		});

		Functions.Admin.GetCommands.setCallback(() => {
			const names = new Array<string>();

			for (const [name] of pairs(this.commands)) names.push(name);

			return names;
		});

		Functions.Admin.HasAccess.setCallback((player) => this.hasAccess(player));

		this.registerCommand("GetMoney", (player) => {
			this.storeService.updateValue(player, "money", (state) => state + 1000);
		});

		this.registerCommand("GetPower", (player) => {
			this.storeService.updateValue(player, "power", (state) => state + 100);
		});

		this.registerCommand("Reset", (player) => {
			this.storeService.reset(player);
		});
	}

	onPlayerRemoving(player: Player): void {
		this.cachedAccess.set(player, undefined);
	}

	hasAccess(player: Player): boolean {
		if (this.cachedAccess.get(player) === undefined) {
			this.cachedAccess.set(
				player,
				RunService.IsStudio() ||
					NAMES.includes(player.Name) ||
					(player.IsInGroup(GROUP_ID) && ROLES.includes(player.GetRoleInGroup(GROUP_ID))),
			);
		}

		return this.cachedAccess.get(player) as boolean;
	}

	registerCommand(name: string, callback: (player: Player) => void): void {
		this.commands.set(name, callback);
	}

	processCommand(name: string, player: Player): void {
		this.commands.get(name)?.(player);
	}
}
