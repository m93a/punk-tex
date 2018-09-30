import * as React from 'react';

import Tab from '.';
import { State } from '../state';
import { Event } from '../event';

import Reference from '../Reference';


class ReferenceManager extends Tab
{
    public static get title() { return 'References' };

    public render()
    {
        return <div>
            {
                this.props.state.references.map( r =>
                    <div key={r.id}>
                        <span>{'[' + r.id + '] '}</span>
                        <Reference {...r} />
                    </div>
                )
            }
            <hr />
            <div>ID: <input /></div>
            <div>Title: <input /></div>
            <div>Author: <input placeholder="name" /><input placeholder="surname" /></div>
            <div>Year of publishing: <input /></div>
            <div>Place of publishing: <input /></div>
        </div>;
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

export default ReferenceManager;