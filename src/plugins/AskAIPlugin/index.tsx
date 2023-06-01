import {
  $getSelection,
  $isRangeSelection,
  createCommand,
  LexicalCommand,
  RangeSelection,
} from 'lexical';
import { ThunderboltFilled, BulbFilled } from '@ant-design/icons';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Input, Modal, Drawer } from 'antd';
import ReactDOM, { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister, registerNestedElementResolver } from '@lexical/utils';
import './index.less';
import { useDispatch, useSelector } from 'react-redux';
import { setaskAI, setaskAISelection } from '../../reducers/globalSlice';
import { $patchStyleText, $setBlocksType, createDOMRange, createRectsFromDOMRange } from '@lexical/selection';
import { PLAYGROUND_TRANSFORMERS } from '../MarkdownTransformers';
import useAIGenarate from './useAIGenarate';
import AIGenPart from './AIGenPart';


export const ASK_AI_COMMAND: LexicalCommand<any> =
  createCommand('ASK_AI_COMMAND');

const AskAIPlugin = ({
  anchorElem,
}) => {
  const [editor] = useLexicalComposerContext();
  const { applyAIText, openDrawer, setOpenDrawer, askAIText, setAskAIText } = useAIGenarate(editor);
  const { showAskAI, askAISelection } = useSelector((state: any) => state.global)
  const [showAskMenu, setShowAskMenu] = useState(true);
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
            const color = '255, 212, 0';
            const style = `position:absolute;top:${selectionRect.top}px;left:${selectionRect.left}px;height:${selectionRect.height}px;width:${selectionRect.width}px;background-color:rgba(${color}, 0.3);pointer-events:none;z-index: 5;`;
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

  useEffect(() => {
    return mergeRegister(
      // 点击编辑器其他部分时，弹窗消失,高亮部分消失
      editor.registerUpdateListener(({ editorState, tags }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if (!tags.has('collaboration') && $isRangeSelection(selection)) {
            dispatch(setaskAI(false))
          }
        });
      }),
    );
  }, [editor]);

  return <>
    {showAskAI &&
      createPortal(
        <div ref={popupRef} id="ask_ai"
        // onClick={handleAIToolBarClick}
        >
          {
            showAskMenu && <Input
              autoFocus
              placeholder='让AI撰写' className='float_ask_ai'
              value={askAIText}
              onChange={(e) => {
                setAskAIText(e.target.value)
              }}
              prefix={
                <BulbFilled className='ask_ai_genarate_question' />
              }
              addonAfter={
                askAIText
                  ? <ThunderboltFilled className='ask_ai_genarate' onClick={() => {
                    setShowAskMenu(false);
                    setOpenDrawer(true);
                  }} />
                  : null}
            />
          }
          {
            <AIGenPart
              openDrawer={openDrawer}
              onApplyText={applyAIText}
              askAIText={askAIText}
              askAISelection={askAISelection}
              onCancel={() => {
                setOpenDrawer(false);
              }} />
          }
          {/* <div className='ask_ai_playground'> */}
          {/* <AIGenPart /> */}
          {/* </div> */}
        </div>,
        anchorElem,
      )
    }
  </>
}

export default AskAIPlugin;
