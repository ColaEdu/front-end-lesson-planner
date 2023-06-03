import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { $createParagraphNode, $createTextNode, $getRoot, EditorState, KEY_ESCAPE_COMMAND, LexicalEditor, ParagraphNode } from "lexical";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import CommentEditorTheme from "../../themes/CommentEditorTheme";
import Placeholder from "../../ui/Placeholder";
import { ThunderboltFilled, BulbFilled, SendOutlined, BulbOutlined } from '@ant-design/icons';
import { $createCodeNode } from "@lexical/code";

function EscapeHandlerPlugin({
  onEscape,
}: {
  onEscape: (e: KeyboardEvent) => boolean;
}): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_ESCAPE_COMMAND,
      (event: KeyboardEvent) => {
        return onEscape(event);
      },
      2,
    );
  }, [editor, onEscape]);

  return null;
}

function EditorRefPlugin({
  editorRef,
}: {
  editorRef: { current: null | LexicalEditor };
}): null {
  const [editor] = useLexicalComposerContext();

  useLayoutEffect(() => {
    editorRef.current = editor;
    return () => {
      editorRef.current = null;
    };
  }, [editor, editorRef]);

  return null;
}


function PlainTextEditor({
  className,
  autoFocus,
  onEscape,
  onChange,
  editorRef,
  aiAdvise,
  placeholder = '给出建议让ai修改！',
}: {
  autoFocus?: boolean;
  className?: string;
  editorRef?: { current: null | LexicalEditor };
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
  onEscape: (e: KeyboardEvent) => boolean;
  aiAdvise: string;
  placeholder?: string;
}) {
  // const [textNode, setTextNode] = useState<any>(null);
  const textNodeRef = useRef<any>(null);
  const initialConfig = {
    namespace: 'ask_ai',
    nodes: [],
    onError: (error: Error) => {
      throw error;
    },
    theme: CommentEditorTheme,
  };
  // 当ai建议改变时，自动填充编辑器，TODO: 封装一个fillAIPlugin
  useEffect(() => {
    if (!editorRef) {
      return;
    }
    editorRef.current?.update(() => {
      const root = $getRoot();
      const p = $createParagraphNode();
      p.append(
        $createTextNode(aiAdvise)
      )
      root.clear().append(p)
    })
  }, [aiAdvise, editorRef])
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="CommentPlugin_CommentInputBox_EditorContainer">
        <PlainTextPlugin
          contentEditable={<ContentEditable className={className} />}
          placeholder={<Placeholder>{placeholder}</Placeholder>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
        {autoFocus !== false && <AutoFocusPlugin />}
        <EscapeHandlerPlugin onEscape={onEscape} />
        <ClearEditorPlugin />
        {editorRef !== undefined && <EditorRefPlugin editorRef={editorRef} />}
      </div>
    </LexicalComposer>
  );
}

export default PlainTextEditor;