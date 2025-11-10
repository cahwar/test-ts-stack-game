import React, { useEffect, useState } from "@rbxts/react";
import { setInterval } from "@rbxts/set-timeout";

export interface MountDelayProps extends React.PropsWithChildren {
	shouldRender: boolean;
	unmountDelay?: number;
	mountDelay?: number;
}

export function MountDelay({ shouldRender, mountDelay = 0, unmountDelay = 0, children }: MountDelayProps) {
	const [render, setRender] = useState(false);

	useEffect(() => {
		return setInterval(
			() => {
				setRender(shouldRender);
			},
			shouldRender ? mountDelay : unmountDelay,
		);
	}, [shouldRender]);

	return <>{render && children}</>;
}
