import { Service } from "@flamework/core";
import { OnPlayerJoined } from "./player-lifecycle.service";
import { isAlive, onCharacterLoaded } from "shared/utils/player-utils";
import { StoreService } from "./store.service";
import { getReplicatedAsset } from "shared/utils/asset-utils";

const WEAPON_FOLDER = getReplicatedAsset("Weapon") as Folder;

function getWeapon(name: string): Tool {
	return WEAPON_FOLDER.FindFirstChild(name) as Tool;
}

@Service()
export class WeaponService implements OnPlayerJoined {
	constructor(private readonly storeService: StoreService) {}

	onPlayerJoined(player: Player): void {
		if (player.Character) this.onCharacterAdded(player, player.Character);
		player.CharacterAdded.Connect((character) => this.onCharacterAdded(player, character));
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private onCharacterAdded(player: Player, character: Model) {
		onCharacterLoaded(player).then(() => {
			this.setModel(player, this.storeService.getValue(player, "weapon").expect());
		});
	}

	private setModel(player: Player, name: string) {
		if (!isAlive(player)) return;

		const character = player.Character as Model;

		character.GetChildren().forEach((child) => {
			if (child.HasTag("ToolDisplay")) child.Destroy();
		});

		const tool = getWeapon(name);
		const handle = (tool.FindFirstChild("Handle") as BasePart).Clone();
		const hand = character.FindFirstChild("RightHand") as BasePart;

		handle.CFrame = hand.CFrame;
		handle.Parent = character;

		const motor = new Instance("Motor6D");
		motor.Parent = handle;
		motor.Part0 = hand;
		motor.Part1 = handle;
		motor.C0 = new CFrame().mul(CFrame.Angles(math.rad(-90), 0, 0));
		motor.C1 = tool.Grip;

		tool.AddTag("ToolDisplay");
	}
}
