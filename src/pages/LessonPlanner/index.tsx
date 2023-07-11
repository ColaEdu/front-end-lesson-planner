import { Button, Empty, Switch } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setaiActive } from "../../reducers/globalSlice";
import CreateModal from "../../settings/createModal";
import { createSchemaField } from "@formily/react";
import {
  Cascader,
  FormItem,
  Input,
  Select,
  Form,
  FormGrid,
  Submit,
} from "@formily/antd-v5";
import { createForm } from "@formily/core";
import './index.less';

const lessonList = {
  小学语文二年级上册部编版: [
    {
      label: "小蝌蚪找妈妈",
      value: "小蝌蚪找妈妈",
    },
    {
      label: "我是什么",
      value: "我是什么",
    },
    {
      label: "植物妈妈有办法",
      value: "植物妈妈有办法",
    },
    {
      label: "梅花",
      value: "梅花",
    },
    {
      label: "场景歌",
      value: "场景歌",
    },
    {
      label: "树之课",
      value: "树之课",
    },
    {
      label: "拍手歌",
      value: "拍手歌",
    },
    {
      label: "田家四季歌",
      value: "田家四季歌",
    },
    {
      label: "曹冲称象",
      value: "曹冲称象",
    },
    {
      label: "红马的故事",
      value: "红马的故事",
    },
    {
      label: "一封信",
      value: "一封信",
    },
    {
      label: "妈妈睡了",
      value: "妈妈睡了",
    },
    {
      label: "古诗二首",
      value: "古诗二首",
    },
    {
      label: "黄山奇石",
      value: "黄山奇石",
    },
    {
      label: "日月潭",
      value: "日月潭",
    },
    {
      label: "葡萄沟",
      value: "葡萄沟",
    },
    {
      label: "坐井观天",
      value: "坐井观天",
    },
    {
      label: "寒号鸟",
      value: "寒号鸟",
    },
    {
      label: "我要的是葫芦",
      value: "我要的是葫芦",
    },
    {
      label: "大禹治水",
      value: "大禹治水",
    },
    {
      label: "朱德的扁担",
      value: "朱德的扁担",
    },
    {
      label: "难忘的泼水节",
      value: "难忘的泼水节",
    },
    {
      label: "古诗二首",
      value: "古诗二首",
    },
    {
      label: "雾在哪里",
      value: "雾在哪里",
    },
    {
      label: "风",
      value: "风",
    },
    {
      label: "雪孩子",
      value: "雪孩子",
    },
    {
      label: "狐假虎威",
      value: "狐假虎威",
    },
  ],
};

export const schema = {
    "type": "object",
    "properties": {
      "fekpflivc7c": {
        "type": "void",
        "x-component": "FormGrid",
        "x-validator": [],
        "x-component-props": {
          "columnGap": 5,
          "rowGap": 4,
          "minWidth": 60
        },
        "x-designable-id": "fekpflivc7c",
        "x-index": 0,
        "properties": {
          "caodzgj3i3t": {
            "type": "void",
            "x-component": "FormGrid.GridColumn",
            "x-validator": [],
            "x-component-props": {
              "gridSpan": 0
            },
            "x-designable-id": "caodzgj3i3t",
            "x-index": 0,
            "properties": {
              "kxcon7qyzlo": {
                "title": "年级",
                "x-decorator": "FormItem",
                "x-component": "Cascader",
                "x-validator": [],
                "x-component-props": {
                  "placeholder": "请选择年级"
                },
                "x-decorator-props": {},
                "x-designable-id": "kxcon7qyzlo",
                "x-index": 0,
                "required": true
              }
            }
          },
          "kknumt9vkp9": {
            "type": "void",
            "x-component": "FormGrid.GridColumn",
            "x-validator": [],
            "x-component-props": {},
            "x-designable-id": "kknumt9vkp9",
            "x-index": 1,
            "properties": {
              "84su6u1xxjd": {
                "title": "科目",
                "x-decorator": "FormItem",
                "x-component": "Select",
                "x-validator": [],
                "x-component-props": {
                  "placeholder": "请选择科目",
                  "style": {
                    "borderRadius": "10px 10px 10px 10px",
                    "backgroundColor": "rgba(69,47,181,1)"
                  }
                },
                "x-decorator-props": {},
                "x-designable-id": "84su6u1xxjd",
                "x-index": 0,
                "required": true
              }
            }
          }
        }
      },
      "mzx4negv6b4": {
        "title": "教材版本",
        "x-decorator": "FormItem",
        "x-component": "Select",
        "x-validator": [],
        "x-component-props": {
          "placeholder": "请选择教材版本"
        },
        "x-decorator-props": {},
        "x-designable-id": "mzx4negv6b4",
        "x-index": 1,
        "required": true
      },
      "ab7t8zcqni7": {
        "title": "课文",
        "x-decorator": "FormItem",
        "x-component": "Select",
        "x-validator": [],
        "x-component-props": {
          "placeholder": "请选择课文"
        },
        "x-decorator-props": {},
        "x-designable-id": "ab7t8zcqni7",
        "x-index": 2,
        "required": true
      }
    },
    "x-designable-id": "3rfphgxf2xi"
  }
const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    Input,
    Select,
    Cascader,
  },
});

const LessonPlanner: React.FC = () => {
  const dispatch = useDispatch();
  const { editId, aiActive } = useSelector((state: any) => state.global);
  const [createVisible, setCreateVisible] = useState(false);
  const showCreateModal = () => {
    setCreateVisible(true);
  };

  const closeCreateModal = () => {
    setCreateVisible(false);
  };
  const devTools = (
    <div
      style={{
        position: "fixed",
        right: 20,
        top: 20,
        display: "flex",
        alignItems: "center",
      }}
    >
      openAI请求&nbsp;&nbsp;
      <Switch
        checkedChildren="开启"
        unCheckedChildren="关闭"
        checked={aiActive}
        onClick={(checked) => {
          dispatch(setaiActive(checked));
        }}
      />
    </div>
  );
  const form = useMemo(
    () =>
      createForm({
        // validateFirst: true,
      }),
    []
  );
  const emptyView = (
    <div className="lessonplan-form">
      <Form form={form} layout="vertical" style={{width: 556}}>
        <SchemaField schema={schema} />
        <Submit size="large" style={{width: '100%'}}>创建教案</Submit>
      </Form>
    </div>
  );
  const [EditorApp, setEditorApp] = useState<any>(null);

  useEffect(() => {
    window.requestIdleCallback(async () => {
      const { default: LoadedEditorApp } = await import("../../EditorApp");
      setEditorApp(() => LoadedEditorApp);
    });
  }, []);
  const renderEditorApp = EditorApp ? <EditorApp /> : <div>loading</div>;

  return (
    <>
      {editId ? renderEditorApp : emptyView}
    </>
  );
};

export default LessonPlanner;
