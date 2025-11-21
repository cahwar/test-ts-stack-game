import { MarketplaceService } from "@rbxts/services";
import { Passes } from "shared/constants/monetization-ids";

const passData: Record<string, GamePassProductInfo> = {};
const productData: Record<string, ProductInfo> = {};

export function getPassData(passId: number): ProductInfo | void {
	const index = tostring(passId);

	if (passData[index] === undefined) {
		try {
			passData[index] = MarketplaceService.GetProductInfo(passId, Enum.InfoType.GamePass);
		} catch (err) {
			warn(err);
		}
	}

	return passData[index];
}

export function getProductData(productId: number): ProductInfo | void {
	const index = tostring(productId);

	if (productData[index] === undefined) {
		try {
			productData[index] = MarketplaceService.GetProductInfo(productId, Enum.InfoType.Product);
		} catch (err) {
			warn(err);
		}
	}

	return productData[index];
}
