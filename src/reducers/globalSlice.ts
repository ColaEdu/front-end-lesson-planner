// Import the required libraries and methods
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { streamOpenAI, streamOpenAIProxy } from '../server/openai';
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
  askAISelection: any;
  askAISelectionBefore: any;
}
const initialState: GlobalState = {
  text: ``,
  aiAdvicePrompt: '', // 调用AI的指令
  aiAdvice: '', // AI助手建议
  aiAdviceWriting: false, // AI正在生成建议
  aiGenerating: false, // AI正在生成
  editId: '',
  aiLoading: false,
  // ask ai显示隐藏按钮，
  showAskAI: false,
  // askAI 选择的文本
  askAISelection: null,
  // askAI 弹窗前的选区
  askAISelectionBefore: null,
  // 开发环境AI开关
  aiActive: true,
};
/**
 * 调用openai异步action
 * @param query 
 * @returns 
 */
export const callOpenAI = (query) => async (dispatch: any) => {
  dispatch(setAIAdviceGenerating(true))
  await streamOpenAI(query, (text) => {
    dispatch(settext(text))
  })
  dispatch(setAIAdviceGenerating(false))
}

/**
 * 调用openai生成建议
 * @param query 
 * @returns 
 */
export const callOpenAIAdvice = (query) => async (dispatch: any) => {
  dispatch(setAIAdviceWriting(true)); // ai正在生成建议
  await streamOpenAIProxy(query, (text) => {
    dispatch(setaskAIAdvice(text))
  })
  dispatch(setAIAdviceWriting(false));
}

// Create the globalSlice using createSlice from Redux Toolkit
const globalSlice = createSlice({
  name: 'global',
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
      state.askAISelection = action.payload;
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
    }
  },
});

// Export the actions generated by the globalSlice
export const { settext, seteditId, setAIloading, 
  setaiActive, setaskAI, setaskAISelection,
  setaskAIAdvicePrompt, setaskAIAdvice,
  setAIAdviceWriting, setAIAdviceGenerating, saveSelection, clearSelection } = globalSlice.actions;

// Export the globalSlice reducer
export default globalSlice;