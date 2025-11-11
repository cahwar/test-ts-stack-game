import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { AdminController } from "client/controllers/admin.controller";
import { useFlameworkDependency } from "client/ui/hooks/use-flamework-dependency";
import { AdminPage } from "./admin-page";
import { PageActivityProps } from "../../page";

export function AdminPageWrapper({ enabled }: PageActivityProps) {
	const controller = useFlameworkDependency<AdminController>();

	const sendRequest = (commandName: string) => controller.sendRequest(commandName);
	const commands = useAtom(controller.commands);

	return <AdminPage enabled={enabled} sendRequest={sendRequest} commands={commands}></AdminPage>;
}
