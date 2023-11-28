import "./App.css";
import React, { useEffect, useId } from "react";
import logo from "./DaiqUIris-Logo.png";
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UploadOutlined,
	UserOutlined,
	VideoCameraOutlined,
} from "@ant-design/icons";
import type { MenuProps, TabsProps } from "antd";
import {
	Col,
	Row,
	Button,
	Divider,
	Upload,
	Layout,
	Menu,
	ConfigProvider,
	theme,
	Result,
	Tabs,
} from "antd";
import { useState } from "react";
import { ChannelsDropdown } from "./Components/ChannelsDropdown";
import { DataGraph } from "./Components/DataGraph/DataGraph";
import { UploadFileButton } from "./Components/UploadFile";
import { DatasourceDropdown } from "./Components/DatasourceDropdown";
import { ErrorDisplay } from "./Components/ErrorDisplay";
import { PSDIframe } from "./Components/PSDIframe";
import { RawSensorTracesIframe } from "./Components/RawSensorTracesIframe";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface UploadProps {
	file: File;
	onSuccess: (response: any, file: File) => void;
	onError: (error: Error) => void;
}

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[]
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
	} as MenuItem;
}

const App: React.FC = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
	const [selectedDataSource, setSelectedDataSource] = useState("");
	const [rerender, setRerender] = useState(false);
	const [hasErrors, setHasErrors] = useState(false);
	const [tabKey, setTabKey] = useState("1");
	const id = useId();
	const otherId = useId();
	const onUpload = () => {
		setRerender(!rerender);
	};

	const {
		token: { colorBgContainer },
	} = theme.useToken();

	function setErrors(errors: boolean) {
		setHasErrors(errors);
	}
	function renderGraph() {
		if (selectedChannel != null) {
			return <DataGraph name={selectedChannel} setErrors={setErrors} />;
		}
	}
	function onChange(key: string) {
		setTabKey(key);
	}
	useEffect(() => {

	}, [selectedChannel, hasErrors]);

	function selectChannel(channel: string | null) {
		setSelectedChannel(channel);
	}

	function selectDataSource(dataSource: string) {
		setSelectedDataSource(dataSource);
		setSelectedChannel(null);
	}

	const items: TabsProps["items"] = [
		{
			key: "1",
			label: "Power Spectral Density",
		},
		{
			key: "2",
			label: "Raw Sensor Traces"
		}
	];

	function renderTabs() {
		switch (tabKey) {
			case "1": return <PSDIframe />;
			case "2": return <RawSensorTracesIframe />;
		}
	}

	return (
		<ConfigProvider
			theme={{
				token: {
					// Seed Token
					colorPrimary: "white",
					colorText: "black",
					colorBgTextHover: "transparent",
				},
			}}
		>
			<Layout className="app-layout">
				<Sider
					className="app-layout-sider"
					trigger={null}
					collapsible
					collapsed={collapsed}
				>
					<div className="demo-logo-vertical" />
					<Menu
						className="app-layout-sider-menu"
						theme="dark"
						mode="vertical"
						items={[
							{
								key: "1",
								icon: <UploadFileButton onUpload={onUpload} />,
							},
							{
								key: "2",
								icon: (
									<DatasourceDropdown
										rerender={rerender}
										onSelect={selectDataSource}
										setErrors={setErrors}
									/>
								),
							},
							{
								key: "3",
								icon: (
									<ChannelsDropdown
										onSelect={selectChannel}
										dataSource={selectedDataSource}
										setErrors={setErrors}
									/>
								),
							},
						]}
					/>
				</Sider>
				<Layout>
					<Header className="app-layout-header">
						<Row justify="center" align="top">
							<Col flex="50%">
								<Button
									className="app-layout-header-button"
									type="text"
									icon={
										collapsed ? (
											<MenuUnfoldOutlined />
										) : (
											<MenuFoldOutlined />
										)
									}
									onClick={() => setCollapsed(!collapsed)}
								/>
							</Col>
							<Col flex="auto">
								<img
									className="app-layout-header-logo"
									src={logo}
									alt="The DaiqUIris"
								/>
							</Col>
						</Row>
						<Divider> </Divider>
					</Header>
					<Content>
						{hasErrors && <ErrorDisplay />}
						{!hasErrors && <>{renderGraph()}</>}
						{selectedDataSource === "Sample Data" && selectedChannel === null && (
							<>
								<Tabs
									items={items}
									defaultActiveKey="1"
									onChange={onChange}
									style={{
										color: "black",
									}}
								/>
								{renderTabs()}
							</>
						)}
					</Content>
					<Footer className="app-layout-footer">
						The DaiqUIris ©2023 Created by: Robin White, Zachary
						Duncan, Matthew Rendall, & Cole Bailey
					</Footer>
				</Layout>
			</Layout>
		</ConfigProvider>
	);
};

export default App;
function styled(Panel: any) {
	throw new Error("Function not implemented.");
}
