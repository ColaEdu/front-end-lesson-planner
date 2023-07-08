import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import LessonPlanner from "./pages/LessonPlanner";
import "./styles.less";
import {
  LessonPlannerIcon,
  LogoutIcon,
  OverViewIcon,
  SettingIcon,
} from "./images/icons/Icons";
const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const renderLogo = collapsed ? (
    <div className="logo-collapsed">
      <div className="avatar"></div>
    </div>
  ) : (
    <div className="logo">
      <div className="avatar"></div>
      <div className="user-info">
        <span className="name">游客</span>
        <span className="email">cola.app</span>
      </div>
    </div>
  );
  return (
    <Router>
      <Layout style={{ height: "100%", display: 'flex'  }}>
        <Sider
          width={232}
          style={{
            background: "#111111",
            width: "232px",
            position: "relative",
          }}
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          {renderLogo}
          <Menu
            theme="dark"
            style={{ background: "#111111" }}
            mode="inline"
            defaultSelectedKeys={["lessonPlanner"]}
          >
            <Menu.Item disabled key="overview" icon={<OverViewIcon />}>
              概览
              {/* <Link to="/overview">概览</Link> */}
            </Menu.Item>
            <Menu.Item key="lessonPlanner" icon={<LessonPlannerIcon />}>
              <Link to="/lessonPlanner">教案助手</Link>
            </Menu.Item>
          </Menu>
          <div className="sider-bottom">
            <Menu
              theme="dark"
              style={{ background: "#111111" }}
              mode="inline"
              defaultSelectedKeys={["lessonPlanner"]}
            >
              <Menu.Item disabled key="setting" icon={<SettingIcon />}>
                设置
              </Menu.Item>
              <Menu.Item disabled key="logout" icon={<LogoutIcon />}>
                登出
              </Menu.Item>
            </Menu>
          </div>
        </Sider>
        <Layout
          className="site-layout"
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Header
            className="site-layout-background"
            style={{
              padding: 0,
              height: 83,
              borderBottom: "1px solid #E1E1E1",
            }}
          >
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </Header>
          <Content
            className="site-layout-background "
            id="appContainer"
            style={{
              padding: 24,
              flex: 1,
              overflowY: "auto",
            }}
          >
            <Routes>
              <Route path="/" element={<LessonPlanner />} />
              <Route path="/lessonPlanner" element={<LessonPlanner />} />
            </Routes>
          </Content>
        </Layout>
        <div className="right-content"></div>
      </Layout>
    </Router>
  );
};

export default App;
