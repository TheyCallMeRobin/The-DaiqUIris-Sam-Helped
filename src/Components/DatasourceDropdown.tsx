import { Select } from "antd"
import { useState, useEffect } from "react";
import { Api } from "../Config";

type props = {
    rerender: boolean;
    selectChannels?: (channels: string[]) => void;
}

export const DatasourceDropdown = (props: props) => {
    const { Option } = Select;
    const [dataSources, setDataSources] = useState([""])

    useEffect(() => {

        const getDataSources = async () => {
            const { data } = await Api.get("/api/files")
            setDataSources(data)

        }
        getDataSources()
        
    }, [props.rerender])

    const getChannels = async (value: any) => {
        const { data } = await Api.get(`/api/channels/file/${value}`)
        
        return data;
    }

    const onSelect = (value: any) => {
        getChannels(value).then((data) => {
            if (props.selectChannels) {
                props.selectChannels(data)
            }
        })
    }

    return (
        <Select 
            className="component-data-source" 
            showSearch placeholder="Data Source" 
            onChange={(value) => onSelect(value)}
        > 
            {dataSources?.map((dataSource) => {
                return (
                    <Option value={dataSource} label={dataSource} key={dataSource}>
                        {dataSource}
                    </Option>
                )
            })}
        </Select>
    )
}