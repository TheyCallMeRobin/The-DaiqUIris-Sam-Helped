import { useEffect, useState } from "react";
import { Api } from "../Config";
import { Select } from "antd";
import "./Components.css";

type props = {
	onSelect: (value: string) => void;
	setErrors?: (hasErrors: boolean) => void;
	dataSource: string;
};

export const ChannelsDropdown = (props: props) => {
	const [channels, setChannels] = useState<string[]>();

	const { Option } = Select;

	const filterOption = (
		input: string,
		option?: { label: string; value: string }
	) => (option?.label ?? "").toLowerCase().startsWith(input.toLowerCase());

	function setErrors(errors: boolean): void {
		if (props.setErrors) {
			props.setErrors(errors);
		}
	}
	async function getChannels() {
		try {
			const { data } = await Api.get(
				`/api/channels/file/${props.dataSource}`
			);
			setChannels(data);
			setErrors(false);
		} catch (error) {
			setErrors(true);
		}
	}

	useEffect(() => {
		if (props.dataSource.length > 0) {
			getChannels();
		}
	}, []);

	const selectOption = (item: string) => {
		props.onSelect(item);
	};

	return (
		<Select
			className="component-channels-dropdown"
			showSearch
			placeholder="Channels"
			filterOption={filterOption}
			onSelect={(x) => selectOption(x)}
			bordered={false}
			showAction={["click"]}
		>
			<Option value="MULTI" label="Multi-Plot" key="None">
				Multi-Plot
			</Option>
			{channels?.map((channel) => {
				return (
					<Option value={channel} label={channel} key={channel}>
						{channel}
					</Option>
				);
			})}
		</Select>
	);
};
