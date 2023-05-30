import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  $setSelection,
  $getPreviousSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  CAN_UNDO_COMMAND,
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
import { setaskAI, setaskAISelection } from '../../reducers/globalSlice';
import { $patchStyleText } from '@lexical/selection';
export const ASK_AI_COMMAND: LexicalCommand<any> =
  createCommand('ASK_AI_COMMAND');

const AskAIPlugin = ({
  anchorElem,
}) => {
  const [editor] = useLexicalComposerContext();
  const { showAskAI, askAISelection } = useSelector((state: any) => state.global)
  const popupRef = useRef<HTMLDivElement | null>(null);
  const prevSelectionRef = useRef<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event: MouseEvent) => {
          if (popupRef.current && popupRef.current.contains(event.target as Node)) {
            // 点击事件在div中，点击输入框时，为什么这个判断没有走？
            console.log('点击事件在div中')
          } else {
            // 点击事件不在div中
            console.log('点击事件不在div中!!')
            // 隐藏ask ai弹窗
            dispatch(setaskAI(false))
            // 清除选中样式
            editor.update(() => {
              dispatch(setaskAISelection(null))
              const selections = $getSelection();
              $patchStyleText(selections.clone(), {background: null});
              $setSelection(null);
              setTimeout(() =>{
              editor.dispatchCommand(CAN_UNDO_COMMAND, false);
              },0)
            })
          }
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      // editor.registerUpdateListener(({ editorState, prevEditorState, tags }) => {
      //   editorState.read(() => {
      //     const selection = $getSelection();
      //     let hasActiveIds = false;
      //     let hasAnchorKey = false;
      //     if ($isRangeSelection(selection)) {
      //       const anchorNode = selection.anchor.getNode();
      //       if ($isTextNode(anchorNode)) {
      //         hasAnchorKey = true;
      //       }
      //     }
      //     if (!hasAnchorKey) {
      //       // setShowAI(false);
      //     }
      //     // if (!tags.has('collaboration') && $isRangeSelection(selection)) {
      //     //   setShowCommentInput(false);
      //     // }
      //   });
      // }),
    );
  }, [editor]);

  return <>
    {showAskAI &&
      createPortal(
        <div ref={popupRef}
        // onClick={handleAIToolBarClick}
        >
          {/* 
          !! 当前方法已弃用，原因是浏览器只会有一个焦点
          当点击一个元素时，浏览器通常会默认触发 "blur" 事件来让富文本编辑器失去焦点 
          当获取焦点时，恢复富文本编辑器的文本选择状态
          --- !!
          */}
          <Input
            autoFocus
            placeholder='让AI撰写' className='float_ask_ai' />
        </div>,
        anchorElem,
      )
    }
  </>
}

export default AskAIPlugin;