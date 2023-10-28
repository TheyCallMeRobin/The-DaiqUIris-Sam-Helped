import { useEffect, useState } from "react"
import { Api } from "../Config"
import { Select } from "antd"
import "./Components.css"

type props = {
    onSelect: (value: string) => void
}

export const ChannelsDropdown = (args: props) => {
    const [channels, setChannels] = useState<string[]>()
    
    const { Option } = Select;

    const filterOption = (input: string, option?: 
        {   label: string; 
            value: string 
        }) =>
    (option?.label ?? '').toLowerCase().startsWith(input.toLowerCase());

    useEffect(() => {

        const getChannels = async () => {
            try {
                const { data } = await Api.get("/api/channels")
                setChannels(data)
            } catch (error) {
                console.error(error)
            }
        }
        getChannels()
    }, [])

    const selectOption = (item: string) => {
        console.log(item)
        args.onSelect(item)
    }

    return (
        <Select 
            className="component-channels-dropdown" 
            showSearch placeholder="Channels" 
            filterOption={filterOption}
            onSelect={(x) => selectOption(x)}
        > 
            {channels?.map((channel) => {
                return (
                    <Option value={channel} label={channel} key={channel}>
                        {channel}
                    </Option>
                )
            })}
        </Select>
    )

}