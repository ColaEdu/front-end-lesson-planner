import {
  $getSelection,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_LOW,
  createCommand,
  EditorState,
  KEY_ESCAPE_COMMAND,
  LexicalCommand,
  LexicalEditor,
  RangeSelection,
} from "lexical";
import { LoadingOutlined, CloseOutlined } from "@ant-design/icons";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Modal, App as AntdApp, Dropdown, MenuProps } from "antd";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import "./index.less";
import { useDispatch, useSelector } from "react-redux";
import {
  setAIAdviceWriting,
  setaskAI,
  setaskAIAdvice,
  setaskAISelection,
} from "../../reducers/globalSlice";
import {
  createDOMRange,
  createRectsFromDOMRange,
  $patchStyleText,
} from "@lexical/selection";
import { $isRootTextContentEmpty, $rootTextContent } from "@lexical/text";
import {
  AIIcon,
  DeleteIcon,
  ImproveWritingIcon,
  InsertIcon,
  LongerIcon,
  RetryIcon,
  ShorterIcon,
  SpellIcon,
} from "../../images/icons/Icons";
import ReactMarkdown from "react-markdown";
import { streamOpenAIProxy } from "../../server/openai";
import { useAIWriting } from ".";

export const ASK_AI_COMMAND: LexicalCommand<any> =
  createCommand("ASK_AI_COMMAND");

const items: MenuProps["items"] = [
  {
    key: "replace",
    label: (
      <span className="ask_ai_menu">
        <SpellIcon className="icon" />
        替换所选内容
      </span>
    ),
  },
  {
    key: "insertAfter",
    label: (
      <span className="ask_ai_menu">
        <InsertIcon className="icon" />
        在下方插入
      </span>
    ),
  },
  {
    key: "retry",
    label: (
      <span className="ask_ai_menu">
        <RetryIcon className="icon" />
        再试一次
      </span>
    ),
  },
  {
    key: "abandon",
    label: (
      <span className="ask_ai_menu">
        <DeleteIcon className="icon" />
        舍弃
      </span>
    ),
  },
];

const AIWritingModal = ({ anchorElem }) => {
  const [editor] = useLexicalComposerContext();
  const { modal } = AntdApp.useApp();
  const {
    showAskAI,
    aiAdvice,
    aiAdvicePrompt,
    aiAdviceWriting,
    askAISelection,
  } = useSelector((state: any) => state.global);
  const { handleGenAdvice, handleInsertAfter, handleReplace } = useAIWriting();
  // const [aiWriting, setAIWriting] = useState(true);

  const popupRef = useRef<HTMLDivElement | null>(null);
  const dropDownRef = useRef<HTMLDivElement | null>(null); // 下拉菜单ref
  const dispatch = useDispatch();

  /**
   * selection的形式会触发焦点变化，故展示ask ai时采取的是标亮之前选中块的逻辑
   * 以下为标亮逻辑
   */
  const selectionState = useMemo(
    () => ({
      container: document.createElement("div"),
      elements: [],
    }),
    []
  );

  const selectionRef = useRef<RangeSelection | null>(null);

  const updateLocation = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = askAISelection;
      // 计算弹窗的位置，并为选区添加背景蒙版
      if ($isRangeSelection(askAISelection)) {
        selectionRef.current = selection.clone();
        const anchor = selection.anchor;
        const focus = selection.focus;
        const range = createDOMRange(
          editor,
          anchor.getNode(),
          anchor.offset,
          focus.getNode(),
          focus.offset
        );
        const boxElem = popupRef.current;
        if (range !== null && boxElem !== null) {
          const { left, bottom, top } = range.getBoundingClientRect();
          const width = 700;
          const selectionRects = createRectsFromDOMRange(editor, range);
          const screenWidth = window.innerWidth;
          const correctedLeft = (screenWidth - width) / 2;
          boxElem.style.left = `${correctedLeft}px`;
          // 当bottom + 20 超过屏幕的一半，将元素置于选区上方
          if (bottom + 20 > window.innerHeight / 2) {
            boxElem.style.top = `${top - boxElem.offsetHeight}px`;
          } else {
            boxElem.style.top = `${bottom + 20}px`;
          }
          // 更新 dropdown-container 位置
          const dropdownElem = dropDownRef.current;
          if (dropdownElem !== null) {
            setTimeout(() => {
              dropdownElem.style.top = "100%";
              dropdownElem.style.left = "0";
            }, 0);
          }

          // boxElem.style.top = `${bottom + 20}px`;

          const selectionRectsLength = selectionRects.length;
          const { container } = selectionState;
          const elements: Array<HTMLSpanElement> = selectionState.elements;
          const elementsLength = elements.length;

          for (let i = 0; i < selectionRectsLength; i++) {
            const selectionRect = selectionRects[i];
            let elem: HTMLSpanElement = elements[i];
            if (elem === undefined) {
              elem = document.createElement("span");
              elements[i] = elem;
              container.appendChild(elem);
            }
            const color = "35, 131, 226";
            const transparentColor = `rgba(${color}, 0)`;

            const style = `position:absolute;top:${selectionRect.top}px;left:${selectionRect.left}px;height:${selectionRect.height}px;width:${selectionRect.width}px;
            background-color:rgba(${transparentColor}, 0.28);pointer-events:none;z-index: 99;`;
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
  }, [editor, selectionState, askAISelection]);

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
    // 当展示弹窗时，默认在弹窗中触发focus,以让编辑器选区失去焦点
    if (showAskAI) {
      const inputBox = popupRef.current;
      if (inputBox !== null) {
        inputBox.focus();
      }
    }
  }, [showAskAI]);
  useEffect(() => {
    window.addEventListener("resize", updateLocation);
    const appContainer = document.getElementById("appContainer");
    // 当container滚动时，计算高度，调整位置
    if (appContainer) {
      appContainer.addEventListener("scroll", updateLocation);
    }
    return () => {
      if (appContainer) {
        appContainer.removeEventListener("scroll", updateLocation);
      }
      window.removeEventListener("resize", updateLocation);
    };
  }, [updateLocation]);
  // 当生成文本时，计算高度，调整位置
  useEffect(() => {
    updateLocation();
  }, [aiAdvice]);
  // 当关闭askAI弹窗时，设置背景为透明
  const setTransparent = () => {
    editor.update(() => {
      $patchStyleText(askAISelection, {
        background: "transparent",
      });
      dispatch(setaskAI(false));
      dispatch(setaskAISelection(null));
    });
  };
  const handleConfirmCancelAI = () => {
    modal.confirm({
      title: "是否忽略AI的建议回复？",
      content: "点击“忽略建议”将不采纳AI的建议回复",
      centered: true,
      icon: <AIIcon />,
      okText: "忽略建议",
      cancelText: "取消",
      autoFocusButton: null,
      // content: 'Some descriptions',
      onOk() {
        setTransparent();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  // 当用户按ESC时，停止生成
  const handleStopGenarate = () => {
    setAIAdviceWriting(false);
  };

  useEffect(() => {
    // 当用户按ESC时，停止生成
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (aiAdviceWriting) {
          // 如果ai正在书写，停止生成
          handleStopGenarate();
        } else {
          // 否则忽略ai建议
          console.log("cancel reason: key down");
          handleConfirmCancelAI();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [handleConfirmCancelAI, aiAdviceWriting]);
  const handleDropdownClick = (e) => {
    const key = e.key;
    // 替换文本
    if (key === "replace") {
      handleReplace();
    }
    // 插入到下方
    if (key === "insertAfter") {
      handleInsertAfter();
    }
    // 再试一次
    if (key === "retry") {
      handleGenAdvice(aiAdvicePrompt);
    }
    // 舍弃
    if (key === "abandon") {
      setTransparent();
    }
  };
  return (
    <div
      ref={popupRef}
      className="AskAIPlugin_AskAIInputBox"
      id="dropdown-container"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <CloseOutlined className="closeIcon" onClick={handleConfirmCancelAI} />
      </div>
      <ReactMarkdown className="ai_writing_genarate">{aiAdvice}</ReactMarkdown>
      <div className="aiWritingBar">
        {aiAdviceWriting ? (
          <>
            <span>
              <AIIcon />
              AI正在书写✍️ <LoadingOutlined />
            </span>
            {/* <Button
            type='text'
            style={{ color: 'rgba(55, 53, 47, 0.5)' }}
            onClick={handleConfirmCancelAI}
          >
            忽略建议 ESC
          </Button> */}
          </>
        ) : (
          <>
            <span>
              <AIIcon />
              以上是AI生成的建议
            </span>
            {/* <Button
            type='text'
            style={{ color: 'rgba(55, 53, 47, 0.5)' }}
            onClick={handleConfirmCancelAI}
          >
            忽略建议 ESC
          </Button> */}
          </>
        )}
      </div>
      {/* <div ref={dropDownRef} className="dropdown-container" id="dropdown-container"></div> */}
      {aiAdviceWriting ? null : (
        <Dropdown
          menu={{ items, onClick: handleDropdownClick }}
          // 下拉菜单的浮层随元素位置变化而改变
          // getPopupContainer={() => document.getElementById('dropdown-container')}
          placement="bottomLeft"
          // arrow
          open
          // onOpenChange={onOpenChange}
        >
          <div style={{ position: "absolute", top: "100%", left: 0 }}></div>
        </Dropdown>
      )}
    </div>
  );
};

export default AIWritingModal;
