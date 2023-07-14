import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import LessonPlanner from "./pages/LessonPlanner";
import "./styles.less";
import {
  LessonPlannerIcon,
  LogoutIcon,
  OverViewIcon,
  SettingIcon,
} from "./images/icons/Icons";
import LessonRight from "./pages/LessonPlanner/Right";
import Login from "./pages/Login";
import { API_PREFIX } from "./constants";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedIn } from "./reducers/globalSlice";
const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loggedIn } = useSelector((state) => state.global);
  useLayoutEffect(() => {
    // 校验token是否过期
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(setLoggedIn(false));
      navigate("/login");
      // window.location.href = '/login';
    } else {
      // 调用校验token接口
      fetch(`//${API_PREFIX}/api/login/verify`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        method: "POST",
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((res) => {
          dispatch(setLoggedIn(true));
        })
        .catch(() => {
          dispatch(setLoggedIn(false));
          navigate("/login");
        });
    }
  }, []);
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
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            loggedIn !== null ? (
              loggedIn ? (
                <Layout style={{ height: "100%", display: "flex" }}>
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
                      padding: "10px 24px",
                      flex: 1,
                    }}
                  >
                    <Routes>
                      <Route path="/" element={<LessonPlanner />} />
                      <Route
                        path="/lessonPlanner"
                        element={<LessonPlanner />}
                      />
                    </Routes>
                  </Content>
                </Layout>
                <div className="right-content">
                  <Routes>
                    <Route path="/" element={<LessonRight />} />
                    <Route path="/lessonPlanner" element={<LessonRight />} />
                  </Routes>
                </div>
              </Layout>
              ) : (
                <Navigate to="/login" />
              )
            ) : (
              <div>Loading...</div>
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;
