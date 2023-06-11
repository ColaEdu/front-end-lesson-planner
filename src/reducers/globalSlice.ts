// Import the required libraries and methods
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HOST_PREFIX } from '../App';
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
  askAISelection: any;
}
const initialState: GlobalState = {
  text: ``,
  aiAdvicePrompt: '', // 调用AI的指令
  aiAdvice: '', // AI助手建议
  aiAdviceWriting: false, // AI正在生成建议
  editId: '',
  aiLoading: false,
  // ask ai显示隐藏按钮，
  showAskAI: false,
  // askAI 选择的文本
  askAISelection: null,
  // 开发环境AI开关
  aiActive: true,
};
/**
 * 调用openai异步action
 * @param query 
 * @returns 
 */
export const callOpenAI = (query) => async (dispatch: any) => {
  await streamOpenAI(query, (text) => {
    dispatch(settext(text))
  })
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
  },
});

// Export the actions generated by the globalSlice
export const { settext, seteditId, setAIloading, setaiActive, setaskAI, setaskAISelection, setaskAIAdvicePrompt, setaskAIAdvice, setAIAdviceWriting } = globalSlice.actions;

// Export the globalSlice reducer
export default globalSlice;