import { Service } from "@flamework/core";
import { OnPlayerJoined } from "./player-lifecycle.service";
import { isPlayerAlive, onCharacterLoaded } from "shared/utils/player-utils";
import { StoreService } from "./store.service";
import { getReplicatedAsset } from "shared/utils/asset-utils";
import { WeaponConfig, WeaponConfigs } from "shared/constants/configs/weapon.config";
import { OnCharacterAdded } from "./character-lifecycle.service";

const WEAPON_FOLDER = getReplicatedAsset("Weapon") as Folder;

function getWeapon(name: string): Tool {
	return WEAPON_FOLDER.FindFirstChild(name) as Tool;
}

@Service()
export class WeaponService implements OnPlayerJoined, OnCharacterAdded {
	constructor(private readonly storeService: StoreService) {}

	onPlayerJoined(player: Player): void {
		this.storeService.onChange(player, "weapon", (newValue: string) => {
			this.setModel(player, newValue);
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onCharacterAdded(player: Player) {
		onCharacterLoaded(player).then(() => {
			this.storeService.useValue(player, "weapon", (value: string) => this.setModel(player, value));

			const weapon = this.storeService.getValue(player, "weapon").expect();

			if (weapon !== undefined) {
				this.setModel(player, weapon);
			}
		});
	}

	getEquippedConfig(player: Player): WeaponConfig | void {
		const weapon = this.storeService.getValue(player, "weapon").expect();

		if (weapon !== undefined) {
			return WeaponConfigs[weapon] as WeaponConfig;
		}
	}

	private setModel(player: Player, name: string): void {
		if (!isPlayerAlive(player)) return;

		const character = player.Character as Model;

		character.GetChildren().forEach((child) => {
			if (child.HasTag("ToolDisplay")) child.Destroy();
		});

		const tool = getWeapon(name);

		const model = (tool.FindFirstChild("Handle") as BasePart).Clone();
		const hand = character.FindFirstChild("RightHand") as BasePart;

		model.CFrame = hand.CFrame;
		model.Parent = character;
		model.Name = name;

		const motor = new Instance("Motor6D");
		motor.Parent = model;
		motor.Part0 = hand;
		motor.Part1 = model;
		motor.C0 = new CFrame().mul(CFrame.Angles(math.rad(-90), 0, 0));
		motor.C1 = tool.Grip;

		model.AddTag("ToolDisplay");
	}
}
