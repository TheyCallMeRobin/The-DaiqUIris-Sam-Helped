import { PlotType } from "plotly.js";

type GraphOption = {
	value: PlotType;
	label: string;
}

const GraphOptions: GraphOption[] = [
    {
        value: "scatter",
        label: "Scatter"
    },
    {
        value: "histogram2dcontour",
        label: "Contour"
    },
    {
        value: "bar",
        label: "Bar"
    }
]

export default GraphOptions;