import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  createCommand,
  EditorState,
  KEY_ESCAPE_COMMAND,
  LexicalCommand,
  LexicalEditor,
  RangeSelection,
} from 'lexical';
import { LoadingOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button, Modal, App as AntdApp } from 'antd';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import './index.less';
import { useDispatch, useSelector } from 'react-redux';
import { setaskAI } from '../../reducers/globalSlice';
import { createDOMRange, createRectsFromDOMRange } from '@lexical/selection';
import { $isRootTextContentEmpty, $rootTextContent } from '@lexical/text';
import { AIIcon } from '../../images/icons/Icons';
import ReactMarkdown from 'react-markdown';


export const ASK_AI_COMMAND: LexicalCommand<any> =
  createCommand('ASK_AI_COMMAND');


const AskAIPlugin = ({
  anchorElem,
}) => {
  const [editor] = useLexicalComposerContext();
  const { modal } = AntdApp.useApp();
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
      // 计算选中区域的位置，并为选区添加背景蒙版
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
          const { left, bottom, width } = range.getBoundingClientRect();
          const selectionRects = createRectsFromDOMRange(editor, range);
          let correctedLeft =
            selectionRects.length === 1 ? left + width / 2 - 125 : left - 125;
          if (correctedLeft < 10) {
            correctedLeft = 10;
          }
          boxElem.style.left = `${correctedLeft}px`;
          boxElem.style.top = `${bottom + 20}px`;
          const selectionRectsLength = selectionRects.length;
          const { container } = selectionState;
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
            const color = '35, 131, 226';
            const style = `position:absolute;top:${selectionRect.top}px;left:${selectionRect.left}px;height:${selectionRect.height}px;width:${selectionRect.width}px;background-color:rgba(${color}, 0.28);pointer-events:none;z-index: 5;`;
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
    /**
     * * bug： selection部分后出现，导致元素堆叠在输入框上方
    * 改进1: 先选中selection,后展示输入框与菜单
     */
    updateLocation();
    const container = selectionState.container;
    // 标亮区块会生成在#root 之外
    const body = document.body;
    // const root = document.getElementById('root')
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
  const handleConfirmCancelAI = () => {
    modal.confirm({
      title: '是否忽略AI的建议回复？',
      content: '点击“忽略建议”将不采纳AI的建议回复',
      centered: true,
      icon: <AIIcon />,
      okText: '忽略建议',
      cancelText: '取消',
      autoFocusButton: null,
      // content: 'Some descriptions',
      onOk() {
        console.log('OK');
        dispatch(setaskAI(false));
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }
  useEffect(() => {
    return mergeRegister(
      // 点击编辑器其他部分时，弹窗消失,高亮部分消失
      editor.registerUpdateListener(({ editorState, tags }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if (!tags.has('collaboration') && $isRangeSelection(selection)) {
            console.log('select 为空！')
            if (showAskAI) {
              // 当点击编辑器其他选区/用户按键ESC/用户点击“取消按钮”时，展示二次询问用户是否取消ai弹窗
              // bug复现步骤：1. 弹窗显示 2. 点击页面蒙版，弹窗消失 3. 弹窗再次出现
              // 原因：页面触发了两次select
              document.body.style.userSelect = 'none';
              handleConfirmCancelAI();
            }
          }
        });
      }),
    );
  }, [editor, showAskAI]);
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleConfirmCancelAI();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [handleConfirmCancelAI]);
  return <div ref={popupRef} className="AskAIPlugin_AskAIInputBox" >
    <ReactMarkdown>
      富文本编辑是现代应用程序中常见的功能之一，它可以使用户轻松地创建和编辑具有丰富格式的文本。为了实现这个功能，我们可以使用开源库来加快开发速度并提高可靠性。

      在这份调研报告中，我们将研究一些目前比较流行的富文本开源库，以便我们在下一次开发富文本编辑器时能够做出更好的决策。
    </ReactMarkdown>
    <div className='aiWritingBar'>
      <span>
        <AIIcon />AI正在书写✍️ <LoadingOutlined />
      </span>
      <Button
        type='text'
        style={{ color: 'rgba(55, 53, 47, 0.5)' }}
        onClick={handleConfirmCancelAI}
      >
        取消 ESC
      </Button>
    </div>

  </div>

}

export default AskAIPlugin;
