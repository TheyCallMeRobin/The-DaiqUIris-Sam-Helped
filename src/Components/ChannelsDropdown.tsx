import '../App.css';
import React from "react"
import { useEffect, useState } from "react"
import { Api } from "../Config"
import { Select } from "antd"


export const ChannelsDropdown = () => {
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


    return (
        <Select 
            className="components-channelsdropdown" 
            showSearch placeholder="Channels" 
            filterOption={filterOption}
        > 
            {channels?.map((channel) => {
                return (
                    <Option value={channel} label={channel}>
                        {channel}
                    </Option>
                )
            })}
        </Select>
    )

}