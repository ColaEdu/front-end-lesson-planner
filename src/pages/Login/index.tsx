import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { API_PREFIX } from "../../constants";
import { useNavigate } from "react-router-dom";
import loginImg from "../../images/login.png";
import "./index.less";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "../../reducers/globalSlice";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    setLoading(true);
    const fetchRes = await fetch(`//${API_PREFIX}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const res = await fetchRes.json();
    if (res.errorCode) {
      message.error(res.message);
    } else {
      localStorage.setItem("token", res.token);
      navigate("/lessonPlanner");
      dispatch(setLoggedIn(true));
    }

    setLoading(false);
  };

  return (
    <div className="login">
      <div className="login-left">
        <img src={loginImg} alt="login" />
        <h1>欢迎来到可乐教育</h1>
      </div>
      <div className="login-right">
        <h1>登录</h1>
        <Form
          name="normal_login"
          className="login-form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="userName"
            label="用户名"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Checkbox>记住密码</Checkbox>
            <a
              className="login-form-forgot"
              href=""
              style={{ marginRight: 10 }}
            >
              忘记密码
            </a>
            <a href="">现在注册</a>
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
