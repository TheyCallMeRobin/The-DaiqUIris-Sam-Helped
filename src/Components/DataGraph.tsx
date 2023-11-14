import { useState, useEffect } from "react";
import { Api } from "../Config";
import Plot from "react-plotly.js";

import "./Components.css";
import { Spin } from "antd";

type props = {
	name: string;
	setErrors?: (hasErrors: boolean) => void;
};

export const DataGraph = (props: props) => {
	const [data, setData] = useState<any>();
	const [isLoading, setLoading] = useState(true);

    function setErrors(errors: boolean): void {
        if (props.setErrors) {
            props.setErrors(errors)
        }
    }

	useEffect(() => {
		const getChartData = async () => {
            console.log("Getting data")
			try {
				const { data } = await Api.get(`/api/channels/${props.name}`);
				setData(data);
				setLoading(false);
                setErrors(false);
			} catch {
                setErrors(true)
            }
		};
		getChartData();
	}, [props.name]);

	if (!isLoading) {
		return (
			<>
				<Plot
					className="component-data-graph"
					data={[
						{
							x: data.times,
							y: data.data[0],
							type: "scatter",
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
