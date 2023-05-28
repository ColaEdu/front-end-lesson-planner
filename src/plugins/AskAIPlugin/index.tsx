import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  $setSelection,
  $getPreviousSelection,
} from 'lexical';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Input, Modal } from 'antd';
import ReactDOM, { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import './index.less';
import { $isLinkNode } from '@lexical/link';
import { $isCodeHighlightNode } from '@lexical/code';
import { getSelectedNode } from '../../utils/getSelectedNode';
import { useDispatch, useSelector } from 'react-redux';
import { setaskAI } from '../../reducers/globalSlice';
export const ASK_AI_COMMAND: LexicalCommand<any> =
  createCommand('ASK_AI_COMMAND');

const AskAIPlugin = ({
  anchorElem,
}) => {
  const [editor] = useLexicalComposerContext();
  const { showAskAI } = useSelector((state: any) => state.global)
  const [isText, setIsText] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const prevSelectionRef = useRef<any>(null);
  const dispatch = useDispatch();
  /**
   * FloatingTextFormatToolbarPlugin组件中点击ask ai，会弹出
   * 此组件，这时需要保留之前的选中状态
   */
  
  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      // Should not to pop up the floating toolbar when using IME input
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      if (selection) {
        const rawTextContent = selection.getTextContent().replace(/\n/g, '');
        console.log('rawTextContent--', rawTextContent)
      }

    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener('selectionchange', updatePopup);
    return () => {
      document.removeEventListener('selectionchange', updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false);
        }
      }),
    );
  }, [editor, updatePopup]);
  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        ASK_AI_COMMAND,
        (payload: any) => {
          dispatch(setaskAI(true))
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerUpdateListener(({ editorState, prevEditorState, tags }) => {
        editorState.read(() => {
          const selection = $getSelection();
          let hasActiveIds = false;
          let hasAnchorKey = false;
          if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            if ($isTextNode(anchorNode)) {
              // const commentIDs = $getMarkIDs(
              //   anchorNode,
              //   selection.anchor.offset,
              // );
              // if (commentIDs !== null) {
              //   setActiveIDs(commentIDs);
              //   hasActiveIds = true;
              // }
              // if (!selection.isCollapsed()) {
              //   setActiveAnchorKey(anchorNode.getKey());
              hasAnchorKey = true;
              // }
            }
          }
          if (!hasAnchorKey) {
            // setShowAI(false);
          }
          // if (!tags.has('collaboration') && $isRangeSelection(selection)) {
          //   setShowCommentInput(false);
          // }
        });
      }),
    );
  }, [editor]);

  return <>
    {showAskAI &&
      createPortal(
        <div ref={popupRef}>
          <Input onClick={(e) => {
            e.stopPropagation()
          }} autoFocus placeholder='让AI撰写' className='float_ask_ai' />
        </div>,
        anchorElem,
      )
    }
  </>
}

export default AskAIPlugin;