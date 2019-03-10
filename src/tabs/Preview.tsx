import * as React from 'react';

import Tab from './Tab';
import { AppState } from '../state';
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
        renderToElement(this.id, this.props.state.project.content);
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
        this.props.state.addEventListener(AppState.Event.ContentChange, this.onChange);
        this.props.state.addEventListener(AppState.Event.ProjectChange, this.onChange);
        this.onChange();
    }

    public componentWillUnmount()
    {
        this.props.state.removeEventListener(AppState.Event.ContentChange, this.onChange);
        this.props.state.removeEventListener(AppState.Event.ProjectChange, this.onChange);
    }
}