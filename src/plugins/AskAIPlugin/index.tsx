import {
  $getSelection,
  $isRangeSelection,
  createCommand,
  EditorState,
  LexicalCommand,
  LexicalEditor,
  RangeSelection,
} from 'lexical';
import { ThunderboltFilled, BulbFilled, SendOutlined, BulbOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Input, Modal, Drawer, Button, Tooltip, Spin } from 'antd';
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
import PlainTextEditor from './PlainTextEditor';
import { $isRootTextContentEmpty, $rootTextContent } from '@lexical/text';


export const ASK_AI_COMMAND: LexicalCommand<any> =
  createCommand('ASK_AI_COMMAND');

// ask_ai输入框onChange事件
function useOnChange(
  setContent: (text: string) => void,
  setCanSubmit: (canSubmit: boolean) => void,
) {
  return useCallback(
    (editorState: EditorState, _editor: LexicalEditor) => {
      editorState.read(() => {
        setContent($rootTextContent());
        setCanSubmit(!$isRootTextContentEmpty(_editor.isComposing(), true));
      });
    },
    [setContent],
  );
}

const AskAIPlugin = ({
  anchorElem,
}) => {
  const [editor] = useLexicalComposerContext();
  const { showAskAI, askAISelection } = useSelector((state: any) => state.global)
  const { applyAIText, openDrawer, setOpenDrawer, askAIText, setAskAIText, askAIToGenarate, aiAdvise, aiAdviseLoading,setAIAdviseLoading } = useAIGenarate(editor);
  const [canSubmit, setCanSubmit] = useState(false);
  const [showAskMenu, setShowAskMenu] = useState(true);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  // PlainText编辑器的ref
  const editorRef = useRef<LexicalEditor>(null);

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
      // if (!openDrawer) {
      //   setTimeout(() => {
      //     setShowAskMenu(true);
      //   }, 1000)
      // }
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
  }, [selectionState.container, updateLocation, openDrawer]);

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

  const onEscape = (event: KeyboardEvent): boolean => {
    event.preventDefault();
    // cancelAddComment();
    return true;
  };
  const onChange = useOnChange(setAskAIText, setCanSubmit);
  const renderAIPopUp = (<>

    <div className="AskAIPlugin_AskAIInputBox" ref={popupRef}>
      <Spin spinning={aiAdviseLoading}>
        <PlainTextEditor
          className="AskAIPlugin_AskAIInputBox_Editor"
          onEscape={onEscape}
          onChange={onChange}
          aiAdvise={aiAdvise}
          editorRef={editorRef}
        />
        <div className='inputbox_container'>
          <Button disabled={!canSubmit} size='small' type='primary' icon={<SendOutlined />}
            onClick={() => {
              setShowAskMenu(false);
              setOpenDrawer(true);
            }}
          >
            优化文本
          </Button>
          <Tooltip title="AI生成建议">
            <BulbOutlined onClick={async () => {
              await askAIToGenarate();
            }} className="ask_ai_advise" />
          </Tooltip>
        </div>
      </Spin>

    </div>
  </>)
  return <>
    {showAskAI &&
      createPortal(
        <>
          {showAskMenu && renderAIPopUp}
          <AIGenPart
            openDrawer={openDrawer}
            onApplyText={applyAIText}
            askAIText={askAIText}
            askAISelection={askAISelection}
            onCancel={() => {
              setOpenDrawer(false);
            }} />
        </>,
        anchorElem,
      )
    }
  </>
}

export default AskAIPlugin;
