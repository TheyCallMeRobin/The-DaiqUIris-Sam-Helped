import "./Components.css";

export const RawSensorTracesIframe = () => {
	return (
		<div className="component-rawsensortracesl-frame">
			<iframe
				src="http://localhost:5000/api/raw-sensor"
				height="100%"
				width="100%"
				style={{
					border: "none",
				}}
				loading="eager"
			></iframe>
		</div>
	);
};
