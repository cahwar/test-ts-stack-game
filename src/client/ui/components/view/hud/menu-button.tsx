import React from "@rbxts/react";
import { PageList } from "client/controllers/ui-page.controller";
import { ReactiveButton } from "../../composables/reactive-button";

export interface MenuButtonProps {
	Page: PageList;
	Title: string;
	Icon: string;
}

export function MenuButton(props: MenuButtonProps) {
	return <ReactiveButton></ReactiveButton>;
}
