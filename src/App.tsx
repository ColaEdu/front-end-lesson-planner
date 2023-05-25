import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  // PlusCircleOutlined,
  FileTextOutlined,
  PlusOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { Layout, Menu, Button, Empty } from "antd";
import React, { useState, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import CreateModal from "./settings/createModal";
import SettingModal from "./settings/settingModal";
const EditorApp = lazy(() => import("./EditorApp"));
const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const { editId } = useSelector((state: any) => state.global)
  // Toggle the visibility of the Modal by updating the settingVisible state
  const showModal = () => {
    setSettingVisible(true);
  };
  const showCreateModal = () => {
    setCreateVisible(true);
  };
  const closeModal = () => {
    setSettingVisible(false);
  };
  const closeCreateModal = () => {
    setCreateVisible(false);
  };

  // Add the Modal component with settingVisible as its visible prop
  const settingsModal = (
    <SettingModal
      visible={settingVisible}
      onCancel={closeModal}
    >
      {/* Add the content of the Modal here */}
    </SettingModal>
  );
  const createModal = (
    <CreateModal
      visible={createVisible}
      onCancel={closeCreateModal}
    >
      {/* Add the content of the Modal here */}
    </CreateModal>
  );
  const emptyView = (
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{
        height: 60,
      }}
      description={
        <span>
          现在创建教案吧！
          {/* 修改 <a
            style={{ color: '#4979e6' }}
            onClick={showModal}
          >
            教案预设
          </a> */}
        </span>
      }
    >
      <Button type="primary" size="large" onClick={showCreateModal}>创建教案！</Button>
    </Empty>
  )
  return (
    <Layout style={{ height: "100%" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" >
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[]}
          items={[
            {
              key: "1",
              icon: <FileTextOutlined />,
              label: "教案1",
            },
            {
              key: "2",
              icon: <FileTextOutlined />,
              label: "教案2",
            },
            {
              key: "3",
              icon: <FileTextOutlined />,
              label: "教案3",
            },
          ]}
        />
        <Button onClick={showCreateModal} type="text" style={{ marginTop: 10, color: '#fff', textAlign: collapsed ? 'center' : 'left' }} block ghost>
          <PlusOutlined />{collapsed ? '' : '新增教案'}
        </Button>
      </Sider>
      <Layout className="site-layout" style={{ height: "100%" }}>
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          {/* <Button type="text" onClick={showModal} icon={<SettingOutlined />}>
            教案预设
          </Button> */}
          {/* <SettingOutlined className="floating-settings-button" onClick={showModal}/> */}
        </Header>
        <Content
          className="site-layout-background "
          style={{
            margin: "24px 16px",
            padding: 24,
            // minHeight: 280,
          }}
        >
          <Suspense fallback={<div>Loading...</div>}>
            {editId ? <EditorApp /> : emptyView}
          </Suspense>
          {/* <FormComponent /> */}
        </Content>
      </Layout>
      {settingsModal}
      {createModal}
    </Layout>
  );
};

export default App;
