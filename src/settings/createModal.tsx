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
const lessonList = {
  '小学语文二年级上册部编版': [
    {
        "label": "小蝌蚪找妈妈",
        "value": "小蝌蚪找妈妈"
    },
    {
        "label": "我是什么",
        "value": "我是什么"
    },
    {
        "label": "植物妈妈有办法",
        "value": "植物妈妈有办法"
    },
    {
        "label": "梅花",
        "value": "梅花"
    },
    {
        "label": "场景歌",
        "value": "场景歌"
    },
    {
        "label": "树之课",
        "value": "树之课"
    },
    {
        "label": "拍手歌",
        "value": "拍手歌"
    },
    {
        "label": "田家四季歌",
        "value": "田家四季歌"
    },
    {
        "label": "曹冲称象",
        "value": "曹冲称象"
    },
    {
        "label": "红马的故事",
        "value": "红马的故事"
    },
    {
        "label": "一封信",
        "value": "一封信"
    },
    {
        "label": "妈妈睡了",
        "value": "妈妈睡了"
    },
    {
        "label": "古诗二首",
        "value": "古诗二首"
    },
    {
        "label": "黄山奇石",
        "value": "黄山奇石"
    },
    {
        "label": "日月潭",
        "value": "日月潭"
    },
    {
        "label": "葡萄沟",
        "value": "葡萄沟"
    },
    {
        "label": "坐井观天",
        "value": "坐井观天"
    },
    {
        "label": "寒号鸟",
        "value": "寒号鸟"
    },
    {
        "label": "我要的是葫芦",
        "value": "我要的是葫芦"
    },
    {
        "label": "大禹治水",
        "value": "大禹治水"
    },
    {
        "label": "朱德的扁担",
        "value": "朱德的扁担"
    },
    {
        "label": "难忘的泼水节",
        "value": "难忘的泼水节"
    },
    {
        "label": "古诗二首",
        "value": "古诗二首"
    },
    {
        "label": "雾在哪里",
        "value": "雾在哪里"
    },
    {
        "label": "风",
        "value": "风"
    },
    {
        "label": "雪孩子",
        "value": "雪孩子"
    },
    {
        "label": "狐假虎威",
        "value": "狐假虎威"
    }
]
}
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
        "placeholder": "请选择教学资源"
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
      "title": "教学主题",
      "x-decorator": "FormItem",
      "x-component": "Select",
      "x-validator": [],
      "x-component-props": {
        "placeholder": "请选择教学资源对应的课文",
        "showSearch": true,
        "options": lessonList['小学语文二年级上册部编版']
      },
      "x-decorator-props": {},
      "name": "teachingTheme",
      "required": true,
      "x-designable-id": "8vtyh2yc13w",
      "x-index": 1
    }
  },
  "x-designable-id": "vdikjwhtn1x"
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
        "teachingTheme": undefined
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