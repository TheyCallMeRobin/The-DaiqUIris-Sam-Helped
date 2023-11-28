import { useEffect, useState } from "react";
import { Api } from "../Config";
import { Spin } from "antd";

export const PSDIframe = () => {
	const [html, setHtml] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const gethtml = async () => {
			const { data } = await Api.get("/api/psd");
			setHtml(data);
			setLoading(false);
		};
		gethtml();
	}, []);

	return (
		<>
			{loading && <>Loading... </>}

			<div style={{ height: "100%", width: "100%" }}>
				<iframe
					srcDoc={html.replaceAll("Loading...", "")}
					height="100%"
					width="100%"
					style={{
						border: "none",
					}}
				></iframe>
			</div>
		</>
	);
};
