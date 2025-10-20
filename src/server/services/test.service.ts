import { Service, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";

const hookPlayer = (player: Player) => {
	print(`${player.DisplayName} has joined the game`);
};

@Service()
export class TestService implements OnStart {
	onStart() {
		print("hello, world!");

		Players.GetPlayers().forEach(hookPlayer);
		Players.PlayerAdded.Connect(hookPlayer);
	}
}
