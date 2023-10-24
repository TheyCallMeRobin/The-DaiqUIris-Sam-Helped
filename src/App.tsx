import './App.css'
import React from 'react';
import logo from "./DaiqUIris-Logo.png";
import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Upload, Layout, Menu, ConfigProvider, theme } from 'antd';
import { useState } from 'react';
import { ChannelsDropdown } from "./Components/ChannelsDropdown"
import { DataGraph } from "./Components/DataGraph"

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

interface UploadProps {
  file: File;
  onSuccess: (response: any, file: File) => void;
  onError: (error: Error) => void;
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const UploadProps: React.FC = () => {
  const customRequest = async ({ file, onSuccess, onError }: UploadProps) => {
    try {
      await uploadFunction(file);
      onSuccess({}, file);
    } catch (error) {
      onError(new Error('Upload failed'));
    }
  };

  const uploadFunction = async (file: File) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('File "${file.name}" uploaded successfully.');
    } catch (err) {
      console.error(err)
    }
  };  

  return (
    <Upload
      customRequest={customRequest as any}
      showUploadList={false}
      >
        <Button type="text" block><UploadOutlined />Upload Files</Button>
      </Upload>
  );
};

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)

  const {
    token: {colorBgContainer},
  } = theme.useToken();

  function renderGraph() {
    if (selectedChannel != null) {
      return (<DataGraph name={selectedChannel} />)
    }
  }

  return (
    <ConfigProvider
      theme={{
        token: {
        // Seed Token
        colorPrimary: 'white',
        colorBgTextHover: 'transparent',
        
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
      <Sider style={{backgroundColor: 'green'}} trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu style={{backgroundColor: 'green'}}
          theme="dark"
          mode="vertical"
          items={[
            {
              key: '1',
              icon: <UploadProps />,
              
            },
          ]}
        />
        <ChannelsDropdown onSelect={setSelectedChannel} />
      </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer}}>
            {/*  */}
            <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            textAlign: 'center',
            background: 'transparent',
          }}
        >
          {/* <img src={logo} alt="The DaiqUIris"/> */}
         {renderGraph()}
        </Content>
        <Footer style={{textAlign:'center'}}>
          The DaiqUIris ©2023 Created by: Robin White, Zachary Duncan, Matthew Rendall, & Cole Bailey
        </Footer>
      </Layout>
    </Layout>

    </ConfigProvider>
    
  );
};

export default App;
function styled(Panel: any) {
  throw new Error('Function not implemented.');
}

