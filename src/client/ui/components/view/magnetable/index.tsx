import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { MagnetableController } from "client/controllers/magnetable.controller";
import { useFlameworkDependency } from "client/ui/hooks/use-flamework-dependency";
import { Magnetable } from "./magnetable";

export function MagnetableWrapper() {
	const magnetableController = useFlameworkDependency<MagnetableController>();

	const magnetables = useAtom(() => magnetableController.get());

	return (
		<>
			{magnetables.map((data) => (
				<Magnetable data={data} key={data.id} />
			))}
		</>
	);
}
