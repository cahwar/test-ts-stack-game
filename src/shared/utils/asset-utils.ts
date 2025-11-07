import { ReplicatedStorage, ServerStorage } from "@rbxts/services";

const replicatedAssets = ReplicatedStorage.FindFirstChild("Assets") as Folder;
const serverAssets = ServerStorage.FindFirstChild("Assets") as Folder;

export function getReplicatedAsset<T extends Instance>(assetName: string): T {
	const asset = replicatedAssets.FindFirstChild(assetName, true) as T;
	return asset;
}

export function getSound(soundName: string): Sound {
	const soundsFolder = replicatedAssets.FindFirstChild("Sounds") as Folder;
	const sound = soundsFolder.FindFirstChild(soundName) as Sound;
	return sound;
}

export function getVfx(vfxName: string): Attachment | ParticleEmitter {
	const vfxFolder = replicatedAssets.FindFirstChild("VFX") as Folder;
	const vfx = vfxFolder.FindFirstChild(vfxName) as Attachment | ParticleEmitter;
	return vfx;
}

export function getServerAsset<T extends Instance>(assetName: string): T {
	const asset = serverAssets.FindFirstChild(assetName, true) as T;
	return asset;
}
