import React, { useEffect, useState } from "@rbxts/react";
import { setInterval } from "@rbxts/set-timeout";

export interface DelayRenderProps extends React.PropsWithChildren {
	ShouldRender: boolean;
	MountDelay?: number;
	UnmountDelay?: number;
}

export function DelayRender({ ShouldRender, MountDelay = 0, UnmountDelay = 0, children }: DelayRenderProps) {
	const [render, setRender] = useState(false);

	useEffect(() => {
		return setInterval(
			() => {
				setRender(ShouldRender);
			},
			ShouldRender ? MountDelay : UnmountDelay,
		);
	}, [ShouldRender]);

	return <>{render && children}</>;
}
