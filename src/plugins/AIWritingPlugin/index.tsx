import React from "react";
import { Dropdown, message, Space } from 'antd';
import Icon from '@ant-design/icons';
import type { MenuProps } from 'antd';
import './index.less'
import { ImproveWritingIcon, LongerIcon, ShorterIcon, SpellIcon } from "../../images/icons/Icons";
import { useDispatch } from "react-redux";
import { setaskAI } from "../../reducers/globalSlice";


// AI书写菜单
const items: MenuProps['items'] = [
  {
    key: 'improveWriting',
    label: (
      <span className="ask_ai_menu"
      >
        <ImproveWritingIcon className="icon" />优化文本
      </span>
    ),
  },
  {
    key: 'spell',
    label: (
      <span className="ask_ai_menu">
        <SpellIcon className="icon" />更正拼写和语法
      </span>
    ),
  },
  {
    key: 'shorter',
    label: (
      <span className="ask_ai_menu">
        <ShorterIcon className="icon" />缩短内容
      </span>
    ),
  },
  {
    key: 'longer',
    label: (
      <span className="ask_ai_menu">
        <LongerIcon className="icon" />扩展内容
      </span>
    ),
  },
];

const AIWritingPlugin = ({
  onOpenChange,
}) => {
  const dispatch = useDispatch();
  const handleDropdownClick = (e) => {
    e.domEvent.preventDefault()
    console.log(`Click on item ${e.key}`);
    dispatch(setaskAI(true));
  };
  
  return <Dropdown 
    menu={{ items, onClick: handleDropdownClick}}
    placement="bottomLeft"
    arrow
    onOpenChange={onOpenChange}
    >
    <button
      className={'popup-item spaced '}
      aria-label="Format text as ai"
      onClick={(e) => {
        e.stopPropagation()
        /**
      * 展示ask ai
      */
        // editor.getEditorState().read(() => {
        //   const selection = $getSelection();
        //   // 无法转换选中区域为Markdown
        //   const selectionContent = selection?.getTextContent();
        //   // const nodes = selection?.getNodes();
        //   // const selectionContent = $convertToMarkdownString();
        //   // console.log('selectionContent--', selectionContent)
        //   dispatch(setaskAISelection(selectionContent))
        //   dispatch(setaskAI(true));
        // })
      }}
    >
      <i className="format ai" />
      <span
        style={{
          color: '#FF8400',
          fontSize: 14
        }}>AI书写</span>
    </button>
  </Dropdown>
}

export default AIWritingPlugin;