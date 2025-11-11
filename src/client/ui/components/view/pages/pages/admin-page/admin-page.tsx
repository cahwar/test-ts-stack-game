import React from "@rbxts/react";
import { usePx } from "client/ui/hooks/use-px";
import { Page, PageActivityProps } from "../../page";
import { Text } from "client/ui/components/composables/text";
import { CommandsList } from "./commands-list";

export interface AdminPageProps extends PageActivityProps {
	sendRequest: (commandName: string) => void;
	commands: Array<string>;
}

export function AdminPage({ enabled, sendRequest, commands }: AdminPageProps) {
	const px = usePx();

	return (
		<Page
			enabled={enabled}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromOffset(px(350), px(350))}
			BackgroundColor3={Color3.fromRGB(133, 120, 199)}
			useStroke={true}
			strokeSize={px(8)}
			strokeColor={Color3.fromRGB(0, 0, 0)}
			cornerRadius={new UDim(0.2, 0)}
		>
			<Text
				Position={UDim2.fromScale(0.5, 0.05)}
				AnchorPoint={new Vector2(0.5, 0)}
				Size={UDim2.fromScale(0.8, 0.15)}
				Text={"Admin Panel"}
				TextScaled={true}
			></Text>

			<CommandsList sendRequest={sendRequest} commands={commands}></CommandsList>
		</Page>
	);
}
