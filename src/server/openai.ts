import { HOST_PREFIX } from "../constants";

export const getSummaryLessonText = async(params: any) => {
  const res = await fetch(`//${HOST_PREFIX}/similarText?teachingTheme=${params.teachingTheme}&textBookName=${params.textBookName}`, {
    method: 'get',
  });
  if (res.ok) {
    return res.json();
  }
  throw new Error('getSummaryLessonText error')
}

export const streamOpenAI = async (query: any, onChunkReturn) => {
  onChunkReturn('');
  const headers = {
    'Content-Type': 'application/json'
  };

  const body = JSON.stringify({
    textBookName: query.textBookName,
    teachingTheme: query.teachingTheme,
    messages: [
      {
        role: 'user',
        content: `请按以下要求生成一篇标准化结构的教案：课本:${query.textBookName},课文标题:${query.title},课文内容:${query.content},`
      }]
  });

  const response = await fetch(`//${HOST_PREFIX}/lessonPlan`, {
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