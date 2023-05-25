import React, { useState } from "react";
import {  Button, Form, Input } from "antd";
// import { Input } from '@formily/antd'
// 引入 antd 默认样式
// import "antd/dist/antd.css";
// 引入 useSelector 和 useDispatch 来使用 globalSlice 中的数据和操作
import { useSelector, useDispatch } from "react-redux";
import globalSlice from "./reducers/globalSlice";
// import "./index.less";

// 创建 FormComponent 组件
const FormComponent: React.FC = () => {
    // 在组件内使用 useSelector 与 useDispatch
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    // 使用 globalSlice 中的 actions 来对状态进行操作
    const { settext } = globalSlice.actions;


    // 当表单提交时，根据需要调用相应的 action7
    const onSubmit = async (values) => {
        // 在这里处理表单提交逻辑
        console.log("表单提交的值:", values);
        const { courseScope, teachingTheme, teachingObjectives, assessmentForm } = values;
        const systemContent = `你是一个教案生成器 根据用户输入与设置的内容,为我生成一个html格式的教案，注意返回结构中只有教案的html结构，多余内容无需生成`
        const content =`教学主题：${teachingTheme}, 课程范围：${courseScope},教学目标：${teachingObjectives}
        评价形式：${assessmentForm}`
        // 使用 fetch 发送请求
        const postRequest = async (data: any) => {
            const response = await fetch("http://47.89.240.174:3000/chat/completions ", {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    // 添加跨域处理相关的头部信息
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Accept-Language, Origin, Proxy-Connection, Referer, User-Agent",
                    "Content-Type": "application/json",
                    // "Origin": "http://43.134.126.166:5000",
                    // "Proxy-Connection": "keep-alive",
                    // "Referer": "http://43.134.126.166:5000/zh",
                    // "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                return result;
            } else {
                setLoading(false);
                throw new Error("Fetch request failed.");
            }
        };
        // 调用 postRequest 函数并传入相关数据
        const postData = {
            model: {
                id: "gpt-3.5-turbo",
                name: "GPT-3.5",
                maxLength: 12000,
                tokenLimit: 4000,
            },
            messages: [
                { role: "system", content: systemContent },
                { role: "user", content: content },
            ],

            temperature: 1,
        };
        setLoading(true);
        const response = await postRequest(postData);
        setLoading(false);
        console.log('response--', response)
        const text = response.choices[0].message.content;
        // 示例：添加表单数据到 globalData
        dispatch(settext(text));
    };
    return (
        // 使用 Form 组件包裹 SchemaField，并传入 form 实例和 onSubmit 函数
        <div style={{ padding: 50 }}>
            <Form onFinish={onSubmit}>
                <Form.Item required name="courseScope" label="课程范围">
                    <Input placeholder="请输入课程范围" />
                </Form.Item>
                <Form.Item required name="teachingTheme" label="教学主题">
                    <Input placeholder="请输入教学主题" />
                </Form.Item>
                <Form.Item required name="teachingObjectives" label="教学目标">
                    <Input placeholder="请输入教学目标" />
                </Form.Item>
                <Form.Item required name="assessmentForm" label="评价形式">
                    <Input placeholder="请输入评价形式" />
                </Form.Item>
                <Form.Item>
                    <Button loading={loading} type="primary" htmlType="submit">
                        生成教案
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

// 默认导出 FormComponent 作为 React 组件
export default FormComponent;
