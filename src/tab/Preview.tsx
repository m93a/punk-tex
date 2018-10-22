import * as React from 'react';

import Tab from './Tab';
import { State } from '../state';
import { renderToElement } from '../compiler';

import Image from '@material-ui/icons/Image';

export default class Preview extends Tab
{
    public static get title() { return 'Preview' };
    public static get icon() { return Image };

    public id = 'render-target';

    public render()
    {
        return <div className='render-target' id={this.id} />;
    }

    public onChange = () =>
    {
        renderToElement(this.id, this.props.state.content);
    }

    public componentWillMount()
    {
        while (document.getElementById(this.id))
        {
            this.id = 'render-target-' + Math.round(Math.random()*10);
        }
    }

    public componentDidMount()
    {
        this.props.state.addEventListener(State.Event.ContentChange, this.onChange);
        this.onChange();
    }

    public componentWillUnmount()
    {
        this.props.state.removeEventListener(State.Event.ContentChange, this.onChange);
    }
}