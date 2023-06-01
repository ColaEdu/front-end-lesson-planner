import { Button, Drawer, Card, Alert } from "antd";
import React from "react";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';


const AIGenPart = (props: any) => {
  const { openDrawer, onCancel, onApplyText, askAIText, askAISelection } = props;
  const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done


A table:

| a | b |
| - | - |
> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done


A table:

| a | b |
| - | - |
> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done


A table:

| a | b |
| - | - |
> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done


A table:

| a | b |
| - | - |
> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done


A table:

| a | b |
| - | - |
> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done


A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:A table:

| a | b |
| - | - |
> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done


A table:

| a | b |
| - | - |
> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done


A table:

| a | b |
| - | - |
> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done


A table:

| a | b |
| - | - |
> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done


A table:

| a | b |
| - | - |
> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done


A table:

| a | b |
| - | - |
> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done


A table:

| a | b |
| - | - |
> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done


A table:

| a | b |
| - | - |
> A block quote with ~strikethrough~ and a URL: https://reactjs.org.A block quote with ~strikethrough~ and a URL: https://reactjs.org.A block quote with ~strikethrough~ and a URL: https://reactjs.org.A block quote with ~strikethrough~ and a URL: https://reactjs.org.A block quote with ~strikethrough~ and a URL: https://reactjs.org.A block quote with ~strikethrough~ and a URL: https://reactjs.org.A block quote with ~strikethrough~ and a URL: https://reactjs.org.A block quote with ~strikethrough~ and a URL: https://reactjs.org.A block quote with ~strikethrough~ and a URL: https://reactjs.org.A block quote with ~strikethrough~ and a URL: https://reactjs.org.A block quote with ~strikethrough~ and a URL: https://reactjs.org.A block quote with ~strikethrough~ and a URL: https://reactjs.org.A block quote with ~strikethrough~ and a URL: https://reactjs.org.A block quote with ~strikethrough~ and a URL: https://reactjs.org.A block quote with ~strikethrough~ and a URL: https://reactjs.org.A block quote with ~strikethrough~ and a URL: https://reactjs.org.A block quote with ~strikethrough~ and a URL: https://reactjs.org.A block quote with ~strikethrough~ and a URL: https://reactjs.org.A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done


A table:

| a | b |
| - | - |
> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done


A table:

| a | b |
| - | - |
`
  return <Drawer
    onClose={onCancel}
    open={openDrawer}
    mask={false}
    closable={false}
    width={"30vw"}
  >
    <Card title="问AI助手" bodyStyle={{ maxHeight: '200px', overflowY: 'auto' }}>
      <Alert
        // message="Info Text"
        description={askAIText}
        type="info"
      />
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {askAISelection}
      </ReactMarkdown>
    </Card>
    <div style={{ maxHeight: '40vh', overflowY: 'auto' }}>
      <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />
    </div>
    <Button size="large" type="primary" style={{ width: '100%', marginTop: 20 }} onClick={onApplyText}>采用该建议</Button>
  </Drawer>

}

export default AIGenPart;