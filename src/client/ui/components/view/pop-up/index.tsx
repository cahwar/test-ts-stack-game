import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { PopUpController } from "client/controllers/pop-up.controller";
import { useFlameworkDependency } from "client/ui/hooks/use-flamework-dependency";
import { Layer } from "../../composables/layer";
import { PopUp } from "./pop-up";
import { useThrottleCallback } from "@rbxts/pretty-react-hooks";
import { getSound } from "shared/utils/asset-utils";
import { playSound } from "shared/utils/sfx-utils";

const POP_SOUND = getSound("Pop");

export function PopUpWrapper() {
	const popUpController = useFlameworkDependency<PopUpController>();

	const popUps = useAtom(() => popUpController.get());
	const playPopSound = useThrottleCallback(() => playSound(POP_SOUND), { wait: 0.2 });

	return (
		<Layer DisplayOrder={1000}>
			{popUps.map((data) => (
				<PopUp data={data} playSound={() => playPopSound.run()} key={data.id} />
			))}
		</Layer>
	);
}
