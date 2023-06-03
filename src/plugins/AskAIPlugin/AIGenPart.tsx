import { Button, Drawer, Card, Alert, Divider } from "antd";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import { callOpenAI } from "../../reducers/globalSlice";
import { streamOpenAI, streamOpenAIProxy } from "../../server/openai";


const AIGenPart = (props: any) => {
  const { openDrawer, onCancel, onApplyText, askAIText, askAISelection } = props;
  const [markdown, setMarkdown] = useState('');
  // const markdownRef = useRef('');
  useEffect(() => {
    if (!openDrawer) {
      return;
    }
    (async () => {
      await streamOpenAIProxy({
        systemMessages: '你是一个教案修改助手，请根据用户的提示给出对应的建议，无需返回其他，只需返回建议部分，以建议的内容！开头',
        userMessage: `请你为我的教案的部分内容给出修改建议，以下是我的教案内容：${askAISelection}`
      }, (text) => {
        setMarkdown(text)
        // markdownRef.current = text;
      })
    })()
  }, [openDrawer])
  return <Drawer
    onClose={onCancel}
    open={openDrawer}
    mask={false}
    closable={true}
    width={"30vw"}
  >
    <Card title="指令" bodyStyle={{ maxHeight: '400px', overflowY: 'auto' }}>
      <div>
        我期望AI按我的指令进行文本优化，以下是我的指令：
      </div>
      <Alert type="info" style={{margin: '10px 0'}} message={askAIText} />
      <div>
        以下是我需要优化的文本：
      </div>
      <Alert type="info" style={{margin: '10px 0'}} message={
         <ReactMarkdown remarkPlugins={[remarkGfm]}>
         {askAISelection}
       </ReactMarkdown>

      } />
        
    </Card>

    <Card title="AI建议" style={{ marginTop: '20px' }} bodyStyle={{ maxHeight: '30vh', overflowY: 'auto' }}>
      <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />
    </Card>

    <Button size="large" type="primary" style={{ width: '100%', marginTop: 20 }} onClick={onApplyText}>采用该建议</Button>
  </Drawer>

}

export default AIGenPart;