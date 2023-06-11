import React, { useEffect, useMemo, useState } from "react";
import { Modal } from 'antd';
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/react'
import { Form, FormItem, Input, Select, Cascader } from '@formily/antd-v5';
import { schema as settingSchema } from './settingModal';
import { createLessonPrompt, CreatePrompt, systemPrompt } from "../utils/promptBuilder";
import { useDispatch, useSelector } from "react-redux";
import globalSlice, { callOpenAI } from "../reducers/globalSlice";
import { getSummaryLessonText } from "../server/openai";

export const schema = {
  "type": "object",
  "properties": {
    "teachingResource": {
      "title": "教学资源",
      "x-decorator": "FormItem",
      "x-component": "Cascader",
      "required": true,
      "x-validator": [],
      "x-component-props": {
        "placeholder": "请选择教学资源",
      },
      "x-decorator-props": {},
      "name": "teachingResource",
      "enum": [
        {
          "children": [
            {
              "children": [
                {
                  "label": "二年级上册",
                  "value": "二年级上册",
                  "children": [
                    {
                      "label": "部编版",
                      "value": "部编版"
                    }
                  ]
                }
              ],
              "label": "语文",
              "value": "语文"
            }
          ],
          "label": "小学",
          "value": "小学"
        }
      ],
      "x-designable-id": "ebnnhj7e2oq",
      "x-index": 0
    },
    "teachingTheme": {
      "type": "string",
      "title": "教学主题",
      "x-decorator": "FormItem",
      "x-component": "Input.TextArea",
      "x-validator": [],
      "x-component-props": {
        "placeholder": "请用简洁的语言描述教学主题，如：课文标题《小蝌蚪找妈妈》"
      },
      "x-decorator-props": {},
      "name": "lessonTarget",
      "description": "",
      "required": true,
      "x-designable-id": "kbhvhvd60ps",
      "x-index": 1
    }
  },
}

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    Cascader
  },
})

const CreateModal: React.FC<any> = (props: any) => {
  const form = useMemo(() => createForm({
    // validateFirst: true,
  }), [])
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { settext, seteditId } = globalSlice.actions;
  const { aiActive } = useSelector(state => state.global);
  const handleOk = async () => {
    const values: any = await form.submit();
    localStorage.setItem('__cola_edu_settings', JSON.stringify({
      teachingResource: values.teachingResource,
    }))
    // const promptText = createLessonPrompt(values as CreatePrompt);
    const postRequest = async (data: any) => {
      const summaryData: any = await getSummaryLessonText(data)
      return summaryData;
    };
    // 调用 postRequest 函数并传入相关数据
    const postData = {
      textBookName: values.teachingResource.join(''),
      teachingTheme: values.teachingTheme
    };
    setLoading(true);
    const response = await postRequest(postData);
    setLoading(false);
    const { text, recordId } = response;
    // 示例：添加表单数据到 globalData
    dispatch(seteditId(recordId));
    if (aiActive) {
      dispatch(callOpenAI({
        textBookName: postData.textBookName,
        title: postData.teachingTheme,
        content: text
      }))
    } else {
      dispatch(settext(`
      # Welcome to the playground

> In case you were wondering what the black box at the bottom is – it's the debug view, showing the current state of the editor. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.

The playground is a demo environment built with “@lexical/react”. Try typing in **some text** with *different* formats.

Make sure to check out the various plugins in the toolbar. You can also use #hashtags or @-mentions too!

If you'd like to find out more about Lexical, you can:

- Visit the [Lexical website](https://lexical.dev/) for documentation and more information.
- Check out the code on our [GitHub repository](https://github.com/facebook/lexical).
- Playground code can be found [here](https://github.com/facebook/lexical/tree/main/packages/lexical-playground).
- Join our [Discord Server](https://discord.com/invite/KmG4wQnnD9) and chat with the team.

Lastly, we're constantly adding cool new features to this playground. So make sure you check back here when you next get a chance 🙂.
# Welcome to the playground

> In case you were wondering what the black box at the bottom is – it's the debug view, showing the current state of the editor. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.

The playground is a demo environment built with “@lexical/react”. Try typing in **some text** with *different* formats.

Make sure to check out the various plugins in the toolbar. You can also use #hashtags or @-mentions too!

If you'd like to find out more about Lexical, you can:

- Visit the [Lexical website](https://lexical.dev/) for documentation and more information.
- Check out the code on our [GitHub repository](https://github.com/facebook/lexical).
- Playground code can be found [here](https://github.com/facebook/lexical/tree/main/packages/lexical-playground).
- Join our [Discord Server](https://discord.com/invite/KmG4wQnnD9) and chat with the team.

Lastly, we're constantly adding cool new features to this playground. So make sure you check back here when you next get a chance 🙂.
# Welcome to the playground

> In case you were wondering what the black box at the bottom is – it's the debug view, showing the current state of the editor. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.

The playground is a demo environment built with “@lexical/react”. Try typing in **some text** with *different* formats.

Make sure to check out the various plugins in the toolbar. You can also use #hashtags or @-mentions too!

If you'd like to find out more about Lexical, you can:

- Visit the [Lexical website](https://lexical.dev/) for documentation and more information.
- Check out the code on our [GitHub repository](https://github.com/facebook/lexical).
- Playground code can be found [here](https://github.com/facebook/lexical/tree/main/packages/lexical-playground).
- Join our [Discord Server](https://discord.com/invite/KmG4wQnnD9) and chat with the team.

Lastly, we're constantly adding cool new features to this playground. So make sure you check back here when you next get a chance 🙂.
      `))
    }
    props.onCancel()
  }
  useEffect(() => {
    // Get the values from localStorage and set them to the form
    const storedValues = localStorage.getItem('__cola_edu_settings');


    if (storedValues) {
      form.setFormState(state => state.values = {
        "teachingResource": JSON.parse(storedValues).teachingResource,
        "teachingTheme": ""
      })
    }
  }, [props.visible])
  return <Modal
    title="创建教案"
    open={props.visible}
    onCancel={props.onCancel}
    onOk={handleOk}
    okText="创建"
    cancelText="取消"
    confirmLoading={loading}
    destroyOnClose
  >
    <Form form={form}
      layout="vertical"
    >
      <SchemaField schema={schema} />
    </Form>
  </Modal>
}

export default CreateModal;