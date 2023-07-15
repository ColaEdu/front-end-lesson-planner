// Import the required libraries and methods
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { genLessonPlan, streamOpenAIProxy } from "../server/openai";
// Define the initial state of the global store
interface GlobalState {
  text: string;
  aiAdvicePrompt: string;
  aiAdvice: string;
  editId: string;
  aiLoading: boolean;
  showAskAI: boolean;
  aiActive: boolean;
  aiAdviceWriting: boolean;
  aiGenerating: boolean;
  askAIState: any;
  askAISelectionBefore: any;
  loggedIn: boolean | null;
}
const initialState: GlobalState = {
  text: `
  # Welcome to the playground

> In case you were wondering what the black box at the bottom is – it's the debug view, showing the current state of the editor. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.

The playground is a demo environment built with “@lexical/react”. Try typing in **some text** with *different* formats.

Make sure to check out the various plugins in the toolbar. You can also use #hashtags or @-mentions too!

If you'd like to find out more about Lexical, you can:

- Visit the [Lexical website](https://lexical.dev/) for documentation and more information.
- Check out the code on our [GitHub repository](https://github.com/facebook/lexical).
- Playground code can be found [here](https://github.com/facebook/lexical/tree/main/packages/lexical-playground).
- Join our [Discord Server](https://discord.com/invite/KmG4wQnnD9) and chat with the team.

Lastly, we're constantly adding cool new features to this playground. So make sure you check back here when you next get a chance 🙂.
# Welcome to the playground

> In case you were wondering what the black box at the bottom is – it's the debug view, showing the current state of the editor. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.

The playground is a demo environment built with “@lexical/react”. Try typing in **some text** with *different* formats.

Make sure to check out the various plugins in the toolbar. You can also use #hashtags or @-mentions too!

If you'd like to find out more about Lexical, you can:

- Visit the [Lexical website](https://lexical.dev/) for documentation and more information.
- Check out the code on our [GitHub repository](https://github.com/facebook/lexical).
- Playground code can be found [here](https://github.com/facebook/lexical/tree/main/packages/lexical-playground).
- Join our [Discord Server](https://discord.com/invite/KmG4wQnnD9) and chat with the team.

Lastly, we're constantly adding cool new features to this playground. So make sure you check back here when you next get a chance 🙂.
# Welcome to the playground

> In case you were wondering what the black box at the bottom is – it's the debug view, showing the current state of the editor. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.

The playground is a demo environment built with “@lexical/react”. Try typing in **some text** with *different* formats.

Make sure to check out the various plugins in the toolbar. You can also use #hashtags or @-mentions too!

If you'd like to find out more about Lexical, you can:

- Visit the [Lexical website](https://lexical.dev/) for documentation and more information.
- Check out the code on our [GitHub repository](https://github.com/facebook/lexical).
- Playground code can be found [here](https://github.com/facebook/lexical/tree/main/packages/lexical-playground).
- Join our [Discord Server](https://discord.com/invite/KmG4wQnnD9) and chat with the team.

Lastly, we're constantly adding cool new features to this playground. So make sure you check back here when you next get a chance 🙂.
      `,
  aiAdvicePrompt: "", // 调用AI的指令
  aiAdvice: "", // AI助手建议
  aiAdviceWriting: false, // AI正在生成建议
  aiGenerating: false, // AI正在生成
  editId: "",
  aiLoading: false,
  // ask ai显示隐藏按钮，
  showAskAI: false,
  // askAI 选择的文本
  askAIState: null,
  // askAI 弹窗前的选区
  askAISelectionBefore: null,
  // 开发环境AI开关
  aiActive: true,
  loggedIn: null,
};
/**
 * 调用openai异步action
 * @param query
 * @returns
 */
export const genAILessonPlan = (query) => async (dispatch: any) => {
  dispatch(setAIAdviceGenerating(true));
  await genLessonPlan(query, (text) => {
    const hasEndTag = /\[END\]/.test(text);

    if (hasEndTag) {
      const filteredText = text.replace(/\[END\]/g, "");
      dispatch(settext(filteredText));
      dispatch(setAIAdviceGenerating(false));
    } else {
      dispatch(settext(text));
    }
  });
  dispatch(setAIAdviceGenerating(false));
};

/**
 * 调用openai生成建议
 * @param query
 * @returns
 */
export const callOpenAIAdvice = (query) => async (dispatch: any) => {
  dispatch(setAIAdviceWriting(true)); // ai正在生成建议
  await streamOpenAIProxy(query, (text) => {
    dispatch(setaskAIAdvice(text));
  });
  dispatch(setAIAdviceWriting(false));
};

// Create the globalSlice using createSlice from Redux Toolkit
const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    settext: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
    seteditId: (state, action: PayloadAction<string>) => {
      state.editId = action.payload;
    },
    setAIloading: (state, action: PayloadAction<boolean>) => {
      state.aiLoading = action.payload;
    },
    setaiActive: (state, action: PayloadAction<boolean>) => {
      state.aiActive = action.payload;
    },
    setaskAI: (state, action: PayloadAction<boolean>) => {
      state.showAskAI = action.payload;
    },
    setaskAISelection: (state, action: PayloadAction<any>) => {
      state.askAIState = action.payload;
    },
    // 更新ai建议指令
    setaskAIAdvicePrompt: (state, action: PayloadAction<any>) => {
      state.aiAdvicePrompt = action.payload;
    },
    // 当生成ai建议时，不断更新
    setaskAIAdvice: (state, action: PayloadAction<any>) => {
      state.aiAdvice = action.payload;
    },
    setAIAdviceWriting: (state, action: PayloadAction<any>) => {
      state.aiAdviceWriting = action.payload;
    },
    // ai正在生成
    setAIAdviceGenerating: (state, action: PayloadAction<any>) => {
      state.aiGenerating = action.payload;
    },
    // 保存选区
    saveSelection: (state, action: PayloadAction<any>) => {
      state.askAISelectionBefore = action.payload;
    },
    // 清除选区
    clearSelection: (state, action: PayloadAction<any>) => {
      state.askAISelectionBefore = null;
    },
    // 设置登录状态
    setLoggedIn: (state, action: PayloadAction<any>) => {
      state.loggedIn = action.payload;
    },
  },
});

// Export the actions generated by the globalSlice
export const {
  settext,
  seteditId,
  setAIloading,
  setaiActive,
  setaskAI,
  setaskAISelection,
  setaskAIAdvicePrompt,
  setaskAIAdvice,
  setAIAdviceWriting,
  setAIAdviceGenerating,
  saveSelection,
  clearSelection,
  setLoggedIn,
} = globalSlice.actions;

// Export the globalSlice reducer
export default globalSlice;
