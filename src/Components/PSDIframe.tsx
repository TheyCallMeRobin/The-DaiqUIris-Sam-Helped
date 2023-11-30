import { useContext, useEffect, useState } from "react";
import { Api } from "../Config";
import { Spin } from "antd";
import "./Components.css";
import { LoadingContext } from "../App";

export const PSDIframe = () => {
	const [html, setHtml] = useState("");

	const { loading, setLoading } = useContext(LoadingContext);

	useEffect(() => {
		const gethtml = async () => {
			//setLoading(true);
			const { data } = await Api.get("/api/psd");
			setHtml(data);

			//setLoading(false);
		};
		gethtml();
	}, []);

	return (
		<>
			{!loading && (
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
		</>
	);
};
