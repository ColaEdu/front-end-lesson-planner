import React, { useEffect, useState } from "react";
import { Dropdown, message, Space } from "antd";
import Icon from "@ant-design/icons";
import type { MenuProps } from "antd";
import "./index.less";
import {
  ImproveWritingIcon,
  LongerIcon,
  ShorterIcon,
  SpellIcon,
} from "../../images/icons/Icons";
import { useDispatch, useSelector } from "react-redux";
import {
  callOpenAIAdvice,
  saveSelection,
  setaskAI,
  setaskAIAdvice,
  setaskAIAdvicePrompt,
  setaskAISelection,
} from "../../reducers/globalSlice";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $createRangeSelection,
  $createTextNode,
  $getRoot,
  $getSelection,
  $setSelection,
  TextNode,
} from "lexical";
import { RangeSelection } from "lexical";
// import { RangeSelection as RangeSelectionClass } from 'lexical';
import { $patchStyleText } from "@lexical/selection";

const promptMap = {
  improveWriting: `我需要你理解文本的内容和上下文，然后找出可能的改进之处。这可能包括提高文本的清晰度、改进词汇选择、增加吸引力或者提高文本的逻辑连贯性。`,
  spell: `我需要你检查文本中的拼写错误和语法错误，并提供修正。`,
  shorter: `我需要你理解文本的主要观点，然后以更简洁的方式表达出来。这可能包括删除冗余的信息，简化复杂的句子，或者将多个观点合并为一个。`,
  longer: `在保持文本主题和观点不变的情况下，增加更多的细节或背景信息。这可能包括添加相关的例子，提供更深入的解释，或者引入新的观点。`,
};

// AI书写菜单
const items: MenuProps["items"] = [
  {
    key: "improveWriting",
    label: (
      <span className="ask_ai_menu">
        <ImproveWritingIcon className="icon" />
        优化文本
      </span>
    ),
  },
  {
    key: "spell",
    label: (
      <span className="ask_ai_menu">
        <SpellIcon className="icon" />
        更正拼写和语法
      </span>
    ),
  },
  {
    key: "shorter",
    label: (
      <span className="ask_ai_menu">
        <ShorterIcon className="icon" />
        缩短内容
      </span>
    ),
  },
  {
    key: "longer",
    label: (
      <span className="ask_ai_menu">
        <LongerIcon className="icon" />
        扩展内容
      </span>
    ),
  },
];

export const useAIWriting = () => {
  const [editor] = useLexicalComposerContext();
  const dispatch = useDispatch();
  const { askAIState, aiAdvice } = useSelector((state) => state.global);
  const handleGenAdvice = (key, textContent) => {
    dispatch(
      callOpenAIAdvice({
        systemMessages:
          "你是一个写作助手，请根据用户的要求修改文本，不需要给出额外的提示！你的回答应该仅包括修改后的文本即可！",
        userMessage: `${promptMap[key]},以下是我要修改的文本内容：${textContent}`,
      })
    );
    dispatch(setaskAIAdvicePrompt(key));
    // 展示askAI弹窗
    dispatch(setaskAI(true));
  };
  const handleInsertAfter = () => {
    editor.update(() => {
      const selection = askAIState.clone() as RangeSelection;

      // // 获取选中文本的开始和结束位置
      const startOffset = selection.anchor.offset;
      const endOffset = selection.focus.offset;
      // // 创建一个新的段落节点
      const newParagraph = $createParagraphNode();
      newParagraph.append($createTextNode(aiAdvice));
      const focusNode = selection.focus.getNode();
      focusNode.insertAfter(newParagraph);
      // 设置选区为透明
      $patchStyleText(selection, { background: "transparent" });
      // 在后面插入不删除之前选中的文本
      dispatch(setaskAI(false));
    });
  };
  const handleReplace = () => {
    editor.update(() => {
      const selection = askAIState.clone() as RangeSelection;
      // 替换文本关键代码
      selection.insertText(aiAdvice);
      $patchStyleText(selection, { background: "transparent" });
      dispatch(setaskAI(false));
      // const focusNode = selection.focus.getNode();

      // // 获取选中文本的开始和结束位置
      // const startOffset = selection.anchor.offset;
      // const endOffset = selection.focus.offset;

      // // 将focusNode在选中文本的开始和结束位置处分割成三个节点
      // const splitNodes = focusNode.splitText(startOffset, endOffset) as TextNode[];

      // // 创建一个新的段落节点
      // const newParagraph = $createParagraphNode();

      // // 在新的段落节点中插入要替换的文本
      // newParagraph.append($createTextNode(aiAdvice));

      // // 在分割出的第二个节点之前插入新的段落节点
      // splitNodes[0].insertAfter(newParagraph);

      // // 删除原来的选中文本所在的节点
      // selection.removeText();
    });
  };

  return {
    handleGenAdvice,
    handleInsertAfter,
    handleReplace,
    editor,
  };
};

const AIWritingPlugin = ({ onOpenChange }) => {
  const dispatch = useDispatch();
  const [aiDivice, setAIAdvice] = useState("");
  const { handleGenAdvice, editor } = useAIWriting();
  const { showAskAI, askAIState } = useSelector(
    (state: any) => state.global
  );
  // 如果展示ai书写弹窗，则添加背景，如果不展示，则设置背景为透明

  const handleDropdownClick = (e) => {
    e.domEvent.preventDefault();
    // 保存当前编辑器状态
    const editorState = editor.getEditorState();
    editor.update(() => {
      const selection = $getSelection() as RangeSelection;
      // 设置选区颜色
      $patchStyleText(selection, { background: "rgba(35, 131, 226, 0.28)" });
    });

    editorState.read(() => {
      const selection = $getSelection() as RangeSelection;
      // 发送AI请求
      handleGenAdvice(e.key, selection?.getTextContent());
      // 将当前选区状态缓存到redux中
      dispatch(setaskAISelection(editorState));
    });
  };

  return (
    <Dropdown
      menu={{ items, onClick: handleDropdownClick }}
      placement="bottomLeft"
      arrow
      // open
      onOpenChange={onOpenChange}
    >
      <button
        className={"popup-item spaced "}
        aria-label="Format text as ai"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <i className="format ai" />
        <span
          style={{
            color: "#FF8400",
            fontSize: 14,
          }}
        >
          AI书写
        </span>
      </button>
    </Dropdown>
  );
};

export default AIWritingPlugin;
