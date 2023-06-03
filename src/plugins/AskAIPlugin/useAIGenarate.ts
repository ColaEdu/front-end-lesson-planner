import { $getSelection, $isRangeSelection, LexicalEditor, 
  $getTextContent, 
  $getRoot} from "lexical";
import React, { useState } from "react";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from '@lexical/markdown';
import { PLAYGROUND_TRANSFORMERS } from "../MarkdownTransformers";
import { streamOpenAIProxy } from "../../server/openai";
import { useSelector } from "react-redux";

// ai 生成文本hook
const useAIGenarate  = (editor: LexicalEditor) => {
  const [askAIText, setAskAIText] = useState('');
  // ai提示建议
  const [aiAdvise, setAIAdvise] = useState('');
  const [aiAdviseLoading, setAIAdviseLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const { askAISelection } = useSelector((state: any) => state.global)

  // 点击提示按钮，让ai生成提示
  const askAIToGenarate = async () => {
    // 此处由于编辑器状态控制问题，暂不使用流输出
    setAIAdviseLoading(true);
    await streamOpenAIProxy({
      systemMessages: '你是一个教案修改助手，请根据用户的提示给出对应的建议，无需返回其他，只需返回一句建议内容，如：优化教案目标',
      userMessage: `请你为我的教案的部分内容给出修改建议，以下是我的教案内容：${askAISelection}`,
      closeStream: true,
    }, (text) => {
      setAIAdvise(text)
      // markdownRef.current = text;
    })
    setAIAdviseLoading(false);
  }
  // 应用ai的生成建议
  const applyAIText = () => {
    // 将选区替换为ai生成的文本
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.removeText();
        selection.insertText(`\n## Hello World!\n`)
        const root = $getRoot();
        
        const textContent = root.getTextContent();
        $convertFromMarkdownString(
          textContent,
          PLAYGROUND_TRANSFORMERS,
        )
      }
    })
  }
  return {
    applyAIText,
    setOpenDrawer,
    openDrawer,
    askAIText,
    setAskAIText,
    askAIToGenarate,
    aiAdvise,
    aiAdviseLoading,
    setAIAdviseLoading
  }
}

export default useAIGenarate;