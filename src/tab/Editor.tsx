import * as React from 'react';

import Tab from '.';
import { State, state } from '../state';
import Event from '../lib/react-helpers/Event';

import Ace from 'react-ace';
import { Ace as AceTypes } from 'ace-builds';
import 'brace/mode/markdown';
import '../theme';

export default class Editor extends Tab
{
    public static get title() { return 'Editor' };

    public editor?: AceTypes.Editor;
    public cursorPosition: AceTypes.Point = {row: 0, column: 0};

    public render()
    {
        return <Ace
            mode="markdown"
            theme="decent"
            className="editor"
            fontSize={16}
            ref={this.mainControl}
            onChange={this.onInternalChange}
            editorProps={{$blockScrolling: false}}
            wrapEnabled
            height="100%"
            value={this.props.state.content}
        />;
    }

    public mainControl = (instance: Ace) =>
    {
        if (!instance) return;

        const editor = this.editor = (instance as any).editor as AceTypes.Editor;

        editor.selection.on('changeCursor', () =>
        {
            state.cursor = editor.getCursorPosition();
            state.cursorOnScreen = editor.getCursorPositionScreen();
        });
    }

    public onInternalChange = (content: string) =>
    {
        this.props.state.content = content;
        this.props.state.dispatchEvent(
            State.Event.ContentChange,
            { source: this }
        );
    }

    public onExternalChange = (e: Event) =>
    {
        if (e.source !== this) this.forceUpdate();
    }

    public componentDidMount()
    {
        this.props.state.addEventListener(
            State.Event.ContentChange,
            this.onExternalChange
        );
    }

    public componentWillUnmount()
    {
        this.props.state.removeEventListener(
            State.Event.ContentChange,
            this.onExternalChange
        );
    }

}