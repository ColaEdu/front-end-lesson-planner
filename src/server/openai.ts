import { HOST_PREFIX } from "../App";

const HOST_PRIFIX = ``
export const getSummaryLessonText = async(params: any) => {
  const res = await fetch(`//${HOST_PREFIX}/similarText?teachingTheme=${params.teachingTheme}&textBookName=${params.textBookName}`, {
    method: 'get',
  });
  if (res.ok) {
    return res.json();
  }
  throw new Error('getSummaryLessonText error')
}

export const streamOpenAI = async (params: any) => {
  const res = await fetch(`https://y42h83s1qy.hk.aircode.run/streamOpenAI`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
  if (res.ok) {
    return res.json();
  }
  throw new Error('streamOpenAI error')
}
export const getDocRecord = async (params: any) => {
  const res = await fetch(`https://y42h83s1qy.hk.aircode.run/getDocRecord?recordId=${params.recordId}`);
  if (res.ok) {
    return res.json();
  }
  throw new Error('getDocRecord error')
}