import { useEventListener } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/react";
import { UserInputService } from "@rbxts/services";

export function useButtonState() {
	const [hovered, setHovered] = useState(false);
	const [pressed, setPressed] = useState(false);

	const buttonStateEvents = {
		onMouseDown: () => setPressed(true),
		onMouseUp: () => setPressed(false),
		onMouseEnter: () => setHovered(true),
		onMouseLeave: () => setHovered(false),
	};

	useEventListener(UserInputService.TouchEnded, () => {
		setPressed(false);
		setHovered(false);
	});

	return [hovered, pressed, buttonStateEvents];
}
