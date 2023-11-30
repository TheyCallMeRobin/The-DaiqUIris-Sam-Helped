import { useState, useEffect } from "react";
import { Api } from "../Config";
import "./Components.css";
import { LoadingProps } from "../types";
import { Spin } from "antd";

export const SensorLocations = (props: LoadingProps) => {
	const [html, setHtml] = useState("");
    const [loading, setLoading] = useState(true);

	useEffect(() => {
		const gethtml = async () => {
			const { data } = await Api.get("/api/sensors");
			setHtml(data);
			setLoading(false)
		};
		gethtml();
	}, []);

	return (
		<Spin spinning={loading} size="large" tip="Loading...">
			{html.length > 0 && (
				<div className="component-psdi-frame">
					<iframe
						srcDoc={html.replaceAll("Loading...", "")}
						height="100%"
						width="100%"
						style={{
							border: "none",
						}}
					></iframe>
				</div>
			)}
		</Spin>
	);
};
