import { $getSelection, $isRangeSelection, LexicalEditor, 
  $getTextContent, 
  $getRoot} from "lexical";
import React, { useState } from "react";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from '@lexical/markdown';
import { PLAYGROUND_TRANSFORMERS } from "../MarkdownTransformers";

// ai 生成文本hook
const useAIGenarate  = (editor: LexicalEditor) => {
  const [askAIText, setAskAIText] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);
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
    setAskAIText
  }
}

export default useAIGenarate;