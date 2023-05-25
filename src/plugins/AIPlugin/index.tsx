import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $insertNodes, } from 'lexical'
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from '@lexical/markdown';
import { PLAYGROUND_TRANSFORMERS } from '../MarkdownTransformers';

const AIPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const globalData = useSelector(state => state.global);
  const dispatch = useDispatch();
  React.useEffect(() => {
    editor.update(() => {
      $getRoot().clear();
    })
  }, [globalData.editId])
  React.useEffect(() => {
    editor.update(() => {
      const markdownString = globalData.text;
      $convertFromMarkdownString(
        markdownString,
        PLAYGROUND_TRANSFORMERS,
      )
    });
  }, [globalData.text])
  return <></>
}

export default AIPlugin;