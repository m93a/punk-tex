import * as React from 'react';

import Tab from '.';
import { State } from '../state';
import { Event } from '../event';

import Ace from 'react-ace';
import 'brace/mode/markdown';
import '../theme';

export default class Editor extends Tab
{
    public static get title() { return 'Editor' };

    public render()
    {
        return <Ace
            mode="markdown"
            theme="decent"
            onChange={this.onInternalChange}
            name="editor"
            editorProps={{$blockScrolling: true}}
            value={this.props.state.content}
        />;
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