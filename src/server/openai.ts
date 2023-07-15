import { API_PREFIX, HOST_PREFIX } from "../constants";

export const getSummaryLessonText = async(params: any) => {
  const res = await fetch(`//${HOST_PREFIX}/similarText?teachingTheme=${params.teachingTheme}&textBookName=${params.textBookName}`, {
    method: 'get',
  });
  if (res.ok) {
    return res.json();
  }
  throw new Error('getSummaryLessonText error')
}

export const genLessonPlan = async (query: any, onChunkReturn) => {
  onChunkReturn('');
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `${token}`
  };

  const body = JSON.stringify({
    textbookId: query.textbook, // 使用的课本id
    textId: query.lesson, // 课文标题 id
  });

  const response = await fetch(`//${API_PREFIX}/api/lesson/plans/generate`, {
    method: 'POST',
    headers,
    body
  });

  const reader = response.body.getReader();
  let chunks = '';
  let texts = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks += new TextDecoder('utf-8').decode(value);
    const hasEndTag = /\[END\]/.test(chunks);
    let filteredChunk = chunks;
    if (hasEndTag) {
      filteredChunk = chunks.replace(/\[END\]/g, "");
    }
    texts += chunks;
    onChunkReturn(texts)
    if (hasEndTag) {
      break;
    }
    try {
      // const result = JSON.parse(chunks);
      // console.log(result);
      chunks = '';
    } catch (e) {
      // incomplete JSON data, keep reading
    }
  }
}

export const streamOpenAIProxy = async (query: any, onChunkReturn) => {
  onChunkReturn('');
  const headers = {
    'Content-Type': 'application/json'
  };
  
  const body = JSON.stringify({
    closeStream: query.closeStream,
    systemMessages: query.systemMessages,
    messages: [
      {
        role: 'user',
        content: query.userMessage
      }],
  });

  const response = await fetch(`//${HOST_PREFIX}/ai`, {
    method: 'POST',
    headers,
    body
  });
  // 如果不支持流式调用，直接返回结果
  if (query.closeStream) {
    const result = await response.json();
    onChunkReturn(result.choices[0].message.content)
    return result.choices[0].message.content;
  }
  const reader = response.body.getReader();
  let chunks = '';
  let texts = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks += new TextDecoder('utf-8').decode(value);
    texts += chunks;
    onChunkReturn(texts)
    try {
      // const result = JSON.parse(chunks);
      // console.log(result);
      chunks = '';
    } catch (e) {
      // incomplete JSON data, keep reading
    }
  }
}