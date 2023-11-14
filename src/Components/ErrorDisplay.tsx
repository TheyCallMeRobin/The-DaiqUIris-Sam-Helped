import { Result } from "antd";

export const ErrorDisplay = () => {
	return (
		<>
			<Result
				status="error"
				title="Unable to render data"
				subTitle="Please ensure that the validity of the data set you are trying to display."
                className="component-error-displays"
			/>
		</>
	);
};
