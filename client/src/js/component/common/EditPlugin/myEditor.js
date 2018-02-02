import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css';
import './editorStyle.less';
import { convertToRaw } from 'draft-js';

const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const plugins = [emojiPlugin];

export default class CustomEmojiEditor extends Component {
  state = {
    editorState: createEditorStateWithText(''),
  };

  onChange = (editorState) => {
    console.log(convertToRaw(editorState.getCurrentContent()));
    this.setState({
      editorState,
    });
  };

  focus = () => {
    this.editor.focus();
  };

  render() {
    return (
      <div>
        <div className="editor" onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={(element) => { this.editor = element; }}
          />
          <EmojiSuggestions />
        </div>
        <div className="options">
          <EmojiSelect />
        </div>
      </div>
    );
  }
}
