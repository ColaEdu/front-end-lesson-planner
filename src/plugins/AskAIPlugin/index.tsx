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
  $createTextNode,
  RangeSelection,
  $getNodeByKey,
  NodeKey,
} from 'lexical';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Input, Modal } from 'antd';
import ReactDOM, { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister, registerNestedElementResolver } from '@lexical/utils';
import './index.less';
import { $isLinkNode } from '@lexical/link';
import { $isCodeHighlightNode } from '@lexical/code';
import { getSelectedNode } from '../../utils/getSelectedNode';
import { useDispatch, useSelector } from 'react-redux';
import { setaskAI, setaskAISelection } from '../../reducers/globalSlice';
import { $patchStyleText, $setBlocksType, createDOMRange, createRectsFromDOMRange } from '@lexical/selection';
import { PLAYGROUND_TRANSFORMERS } from '../MarkdownTransformers';
import { $createMarkNode, $getMarkIDs, $isMarkNode, MarkNode } from '@lexical/mark';
export const ASK_AI_COMMAND: LexicalCommand<any> =
  createCommand('ASK_AI_COMMAND');

const AskAIPlugin = ({
  anchorElem,
}) => {
  const [editor] = useLexicalComposerContext();
  const { showAskAI, askAISelection } = useSelector((state: any) => state.global)
  const popupRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  /**
   * selection的形式会触发焦点变化，故展示ask ai时采取的是标亮之前选中块的逻辑
   * 以下为标亮逻辑
   */
  const selectionState = useMemo(
    () => ({
      container: document.createElement('div'),
      elements: [],
    }),
    [],
  );
  const selectionRef = useRef<RangeSelection | null>(null);
  const updateLocation = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        selectionRef.current = selection.clone();
        const anchor = selection.anchor;
        const focus = selection.focus;
        const range = createDOMRange(
          editor,
          anchor.getNode(),
          anchor.offset,
          focus.getNode(),
          focus.offset,
        );
        const boxElem = popupRef.current;
        if (range !== null && boxElem !== null) {
          const {left, bottom, width} = range.getBoundingClientRect();
          const selectionRects = createRectsFromDOMRange(editor, range);
          let correctedLeft =
            selectionRects.length === 1 ? left + width / 2 - 125 : left - 125;
          if (correctedLeft < 10) {
            correctedLeft = 10;
          }
          boxElem.style.left = `${correctedLeft}px`;
          boxElem.style.top = `${bottom + 20}px`;
          const selectionRectsLength = selectionRects.length;
          const {container} = selectionState;
          const elements: Array<HTMLSpanElement> = selectionState.elements;
          const elementsLength = elements.length;

          for (let i = 0; i < selectionRectsLength; i++) {
            const selectionRect = selectionRects[i];
            let elem: HTMLSpanElement = elements[i];
            if (elem === undefined) {
              elem = document.createElement('span');
              elements[i] = elem;
              container.appendChild(elem);
            }
            const color = '255, 212, 0';
            const style = `position:absolute;top:${selectionRect.top}px;left:${selectionRect.left}px;height:${selectionRect.height}px;width:${selectionRect.width}px;background-color:rgba(${color}, 0.3);pointer-events:none;z-index:5;`;
            elem.style.cssText = style;
          }
          for (let i = elementsLength - 1; i >= selectionRectsLength; i--) {
            const elem = elements[i];
            container.removeChild(elem);
            elements.pop();
          }
        }
      }
    });
  }, [editor, selectionState]);

  useLayoutEffect(() => {
    updateLocation();
    const container = selectionState.container;
    const body = document.body;
    if (body !== null) {
      body.appendChild(container);
      return () => {
        body.removeChild(container);
      };
    }
  }, [selectionState.container, updateLocation]);

  useEffect(() => {
    window.addEventListener('resize', updateLocation);
    return () => {
      window.removeEventListener('resize', updateLocation);
    };
  }, [updateLocation]);
 
  useEffect(() => {
    return mergeRegister(
       // 点击编辑器其他部分时，弹窗消失
       editor.registerUpdateListener(({editorState, tags}) => {
        editorState.read(() => {
          const selection = $getSelection();
          if (!tags.has('collaboration') && $isRangeSelection(selection)) {
            dispatch(setaskAI(false))
          }
        });
      }),
      // editor.registerCommand(
      //   CLICK_COMMAND,
      //   (event: MouseEvent) => {
      //     if (popupRef.current && popupRef.current.contains(event.target as Node)) {
      //       // 点击事件在div中，点击输入框时，为什么这个判断没有走？
      //       console.log('点击事件在div中')
      //     } else {
      //       // 点击事件不在div中
      //       console.log('点击事件不在div中!!')
      //       // 隐藏ask ai弹窗
      //       dispatch(setaskAI(false))
      //       // 清除选中样式
      //       editor.update(() => {
      //         dispatch(setaskAISelection(null))
      //         const selections = $getSelection();
      //         if (selections) {
      //           // 替换ask ai后的结果
      //           // (selections as RangeSelection).removeText()
      //           // selections.insertRawText(`\n# Hello World!\n## 123
      //           // `)
      //         }
      //       })
      //     }
      //     return true;
      //   },
      //   COMMAND_PRIORITY_LOW
      // ),
    );
  }, [editor]);

  return <>
    {showAskAI &&
      createPortal(
        <div ref={popupRef}
        // onClick={handleAIToolBarClick}
        >
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
