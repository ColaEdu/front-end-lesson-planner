import { $getSelection, LexicalEditor } from "lexical";
import React from "react";

// ai 生成文本hook
const useAIGenarate  = (editor: LexicalEditor) => {
  const applyAIText = () => {
    // 将选区替换为ai生成的文本
    editor.update(() => {
      const selection = $getSelection();
      console.log('getTextContent--', selection?.getTextContent())
    })
  }
  return {
    applyAIText
  }
}

export default useAIGenarate;