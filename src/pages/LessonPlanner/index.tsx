import { Button, Empty, Switch } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setaiActive } from "../../reducers/globalSlice";
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
            "grade": {
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
              "required": true,
              "name": "grade",
              "enum": [
                {
                  "children": [
                    {
                      "label": "二年级",
                      "value": "二年级"
                    }
                  ],
                  "label": "小学",
                  "value": "小学"
                }
              ],
              "default": "{{[\"小学\", \"二年级\"]}}"
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
            "subject": {
              "title": "科目",
              "x-decorator": "FormItem",
              "x-component": "Select",
              "x-validator": [],
              "x-component-props": {
                "placeholder": "请选择科目"
              },
              "x-decorator-props": {},
              "x-designable-id": "84su6u1xxjd",
              "x-index": 0,
              "required": true,
              "name": "subject",
              "default": "{{\"语文\"}}",
              "enum": [
                {
                  "children": [],
                  "label": "语文",
                  "value": "语文"
                }
              ]
            }
          }
        }
      }
    },
    "textbook": {
      "title": "教材版本",
      "x-decorator": "FormItem",
      "x-component": "Select",
      "x-validator": [],
      "x-component-props": {
        "placeholder": "请选择教材版本"
      },
      "x-reactions": {
        "dependencies": [],
        "fulfill": {
          "run": "$effect(() => {\n  $self.loading = true\n  fetch(\"//129.226.81.213:4010/api/lesson/textbooks\")\n    .then((response) => response.json())\n    .then(\n      ({ textbooks }) => {\n        $self.loading = false\n        $self.dataSource = textbooks.map(item => ({label: item.name, value: item._id}))\n      },\n      () => {\n        $self.loading = false\n      }\n    )\n}, [])\n"
        }
      },
      "x-decorator-props": {},
      "x-designable-id": "mzx4negv6b4",
      "x-index": 1,
      "required": true,
      "name": "textbook",
      "enum": [
        {
          "children": [],
          "label": "选项 1",
          "value": "zkkowuose8o"
        }
      ]
    },
    "lesson": {
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
      "required": true,
      "name": "lesson",
      "x-reactions": {
        "dependencies": [
          {
            "property": "value",
            "type": "any",
            "source": "textbook",
            "name": "textbook"
          }
        ],
        "fulfill": {
          "run": "$effect(() => {\n  if (!$deps.textbook) {\n    return;\n  }\n  $self.loading = true\n  fetch(`//129.226.81.213:4010/api/lesson/textbook/${$deps.textbook}/texts`)\n    .then((response) => response.json())\n    .then(\n      ({ texts }) => {\n        $self.loading = false\n        $self.dataSource = texts.map((item) => ({\n          label: item.name,\n          value: item._id,\n        }))\n      },\n      () => {\n        $self.loading = false\n      }\n    )\n}, [$deps.textbook])\n"
        }
      }
    }
  },
  "x-designable-id": "5ltoquzrusr"
};
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
        <SchemaField schema={schema}  />
        <Submit onSubmit={(values) => {
          // TODO 调用生成教案接口
        }} size="large" style={{width: '100%'}}>创建教案</Submit>
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
