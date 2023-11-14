import { Select } from "antd";
import { useState, useEffect } from "react";
import { Api } from "../Config";

type props = {
	rerender: boolean;
	onSelect?: (dataSource: string) => void;
	setErrors?: (hasErrors: boolean) => void;
};

export const DatasourceDropdown = (props: props) => {
	const { Option } = Select;
	const [dataSources, setDataSources] = useState([""]);

	useEffect(() => {
		const getDataSources = async () => {
			try {
				const { data } = await Api.get("/api/files");
				setDataSources(data);
				setErrors(false);
			} catch (error) {
				setErrors(true);
			}
		};
		getDataSources();
	}, [props.rerender]);

	const getChannels = async (value: string) => {
		try {
			const { data } = await Api.get(`/api/channels/file/${value}`);
			setErrors(false);
			return data;
		} catch (error) {
			setErrors(true);
		}
	};

	function setErrors(errors: boolean): void {
		if (props.setErrors) {
			props.setErrors(errors);
		}
	}

	const onSelect = (value: string) => {
		getChannels(value).then(() => {
			if (props.onSelect) {
				props.onSelect(value);
			}
		});
	};

	return (
		<Select
			className="component-data-source"
			showSearch
			placeholder="Data Source"
			onChange={(value) => onSelect(value)}
		>
			{dataSources?.map((dataSource) => {
				return (
					<Option
						value={dataSource}
						label={dataSource}
						key={dataSource}
					>
						{dataSource}
					</Option>
				);
			})}
		</Select>
	);
};
