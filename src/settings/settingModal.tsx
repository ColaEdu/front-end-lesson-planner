import React, { useEffect, useMemo } from "react";
import { message, Modal } from 'antd';
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/react'
import { Form, FormItem, Input } from '@formily/antd-v5';
import { Select } from 'antd';



export const schema = {
  "type": "object",
  "properties": {
    "teachingResource": {
      "title": "教学资源",
      "x-decorator": "FormItem",
      "x-component": "Select",
      "x-validator": [],
      "required": true,
      "x-decorator-props": {
        "tooltip": "目前仅支持国家小学二年级数学的学习资源"
      },
      "x-component-props": {
        "mode": "multiple",
        "options": [
          {
            "children": [],
            "label": "小学二年级数学",
            "value": "小学二年级数学"
          }
        ]
      },
      // "description": "目前仅支持国家小学二年级数学的学习资源",
      "enum": [
        {
          "children": [],
          "label": "小学二年级数学",
          "value": "小学二年级数学"
        }
      ],
      // "default": ["小学二年级数学"],
      "x-designable-id": "mzsfjvrcv8n",
      "x-index": 0,
      "name": "teachingResource"
    },
    "teachingTime": {
      "title": "教学时长",
      "x-decorator": "FormItem",
      "x-component": "Select",
      "x-validator": [],
      default: "45分钟",
      "x-component-props": {
        options: [
          {
            "children": [],
            "label": "30分钟",
            "value": "30分钟"
          },
          {
            "children": [],
            "label": "45分钟",
            "value": "45分钟"
          }
        ],
      },
      "x-decorator-props": {},
      "required": true,
      "enum": [
        {
          "children": [],
          "label": "30分钟",
          "value": "30分钟"
        },
        {
          "children": [],
          "label": "45分钟",
          "value": "45分钟"
        }
      ],
      "x-designable-id": "0x4507d1loy",
      "x-index": 1,
      "name": "teachingTime"
    }
  },
  "x-designable-id": "2itjw5ls3wv"
}

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Select,
  },
})

const SettingModal: React.FC<any> = (props: any) => {
  const form = useMemo(() => createForm({
    // validateFirst: true,
  }), [])
  const handleOk = async () => {
    const values = await form.submit();
    // Store the preset values in localStorage under the key __cola_edu_settings
    localStorage.setItem('__cola_edu_settings', JSON.stringify(values));
    message.success('预设保存成功！')
    props.onCancel();
  }
  useEffect(() => {
    // Get the values from localStorage and set them to the form
    const storedValues = localStorage.getItem('__cola_edu_settings');
    if (storedValues) {
      form.setFormState(state => state.values = JSON.parse(storedValues))
    }
  }, [props.visible])
  return <Modal
    title="教案预设"
    open={props.visible}
    onCancel={props.onCancel}
    onOk={handleOk}
    okText="保存预设"
    cancelText="取消"
    destroyOnClose
  >
    <Form form={form}
      layout="vertical"
    >
      <SchemaField schema={schema} />
    </Form>
  </Modal>
}

export default SettingModal;