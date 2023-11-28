
export const RawSensorTracesIframe = () => {
    return (
		<div style={{height: "100%", width: "100%"}}>
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
    )
}