import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { useFlameworkDependency } from "client/ui/hooks/use-flamework-dependency";
import { Layer } from "../../composables/layer";
import { Floater } from "./floater";
import { FloaterController } from "client/controllers/floater-controller";

export function FloatersWrapper() {
	const floaterController = useFlameworkDependency<FloaterController>();

	const floaters = useAtom(() => floaterController.get());

	return (
		<Layer DisplayOrder={1000}>
			{floaters.map((data) => (
				<Floater data={data} key={data.id} />
			))}
		</Layer>
	);
}
