import { useState, useEffect } from "react";
import { Api } from "../../Config";
import Plot from "react-plotly.js";

import "../Components.css";
import { Row, Select, Spin } from "antd";
import { PlotType } from "plotly.js";
import GraphOptions from "./GraphOptions";

type props = {
	name: string;
	setErrors?: (hasErrors: boolean) => void;
};


export const DataGraph = (props: props) => {
	const [data, setData] = useState<any>();
	const [graphType, setGraphType] = useState<PlotType>("scatter");
	const [isLoading, setLoading] = useState(true);

	function setErrors(errors: boolean): void {
		if (props.setErrors) {
			props.setErrors(errors);
		}
	}

	useEffect(() => {
		const getChartData = async () => {
			try {
				const { data } = await Api.get(`/api/channels/${props.name}`);
				setData(data);
				setLoading(false);
				setErrors(false);
			} catch {
				setErrors(true);
			}
		};
		getChartData();
	}, [props.name]);

	const { Option } = Select;



	if (!isLoading) {
		return (
			<>
				<Row align={"middle"} justify={"center"} style={{paddingTop: "2rem"}}>
					<Select placeholder="Graph Type" onSelect={setGraphType}>
						{GraphOptions.map((option) => {
							return <Option key={option.label} value={option.value}>{option.label}</Option>
						})}
					</Select>
				</Row>

				<Plot
					className="component-data-graph"
					data={[
						{
							x: data.times,
							y: data.data[0],
							type: graphType,
							mode: "lines",
							name: "EEG Data",
							textinfo: "label",
							yaxis: "uV",
							xaxis: "s",
						},
					]}
					layout={{
						title: props.name,
						xaxis: { ticksuffix: "s", title: "Time (s)" },
						yaxis: {
							ticksuffix: "pV",
							title: "Voltage Potential (pV)",
							showexponent: "none",
						},
					}}
					config={{
						displaylogo: false,
					}}
				/>
			</>
		);
	} else {
		return <Spin size="large" />;
	}
};
