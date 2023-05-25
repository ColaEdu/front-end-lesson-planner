
export const systemPrompt = `你是一个教案生成器，请遵从用户的条件，收集汇总资源并生成一份教案，
注意事项:你必须按照
<body>
  <h1>{教案标题}<h1>
  <h2>教学目标</h2>
  <p>{教学目标内容}</p>
  <h2>教学资源</h2>
  <p>{教学资源内容}</p>
  <h2>教学过程<h2>
  <p>{教学过程内容}</p>
</body>
这样的格式输出,不能使用ul,ol等标签！不能使用“/\n”仅使用h1,h2,h3,p等标签
生成花括号{}内的内容,无需输出其他额外内容,不要重复生成内容！`

export interface CreatePrompt {
  // 教学资源
  "teachingResource"?: string[];
  // 教学时长
  "teachingTime"?: string,
  // 教学主题
  "lessonTheme"?: string,
  // 教学目标
  "lessonTarget"?: string
}

export const createLessonPrompt = (values: CreatePrompt) => {
  let promptText = `请根据以下条件,在你的知识范围内为我生成一份教案:`;
    if (values.teachingResource) {
    promptText += `教学资源：在${values.teachingResource.join(",")}范围内进行寻找。`;
  }
  if (values.teachingTime) {
    promptText += `教学时长：${values.teachingTime}。`;
  }
  if (values.lessonTheme) {
    promptText += `教学主题：${values.lessonTheme}。`;
  }
  if (values.lessonTarget) {
    promptText += `教学目标：${values.lessonTarget}。`;
  }

  return promptText;
}