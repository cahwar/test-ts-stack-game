import { Controller, OnInit } from "@flamework/core";
import { atom } from "@rbxts/charm";
import { Events, Functions } from "client/network";

@Controller()
export class AdminController implements OnInit {
	public commands = atom<Array<string>>([]);
	public hasAccess = atom<boolean>(false);

	onInit(): void | Promise<void> {
		Functions.Admin.GetCommands.invoke().then((value) => this.commands(value));
		Functions.Admin.HasAccess.invoke().then((value) => this.hasAccess(value));
	}

	sendRequest(commandName: string): void {
		if (this.commands().includes(commandName)) Events.Admin.ProcessCommand(commandName);
	}
}
