import { useState, useEffect } from 'react'
import { Api } from "../Config"
import Plot from 'react-plotly.js';

type props = {
    name: string
}

export const DataGraph = (args: props) => {
    const [data, setData] = useState<any>()

    useEffect(() => {

        const getChartData = async () => {

            const { data } = await Api.get(`/api/channels/${args.name}`);
            setData(data)
        }
        getChartData()
    }, [args.name])

    if (data) {
        return (

            <>
                <Plot 
                    data={[
                        {
                            x: data.times,
                            y: data.data[0],
                            type: 'scatter',
                            mode: 'lines',
                            name: 'EEG Data',
                            textinfo: "label",
                            yaxis: "uV",
                            xaxis: "s"

                    }
                    ]}
                    layout={
                        {
                            title: args.name, 
                            xaxis: {ticksuffix: "s", title: "Time (s)"}, 
                            yaxis: {ticksuffix: "pV", title: "Voltage Potential (pV)", showexponent: 'none'},
                        }
                    }
                    config={
                        {
                            displaylogo: false,
                        }
                    }
                />
            </>
        )
    } else {
        return (
            <>Loading...</>
        )
    }

    
}