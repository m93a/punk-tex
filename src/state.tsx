import { EventTarget, addEventListener, removeEventListener, dispatchEvent } from './event';
import sampleText from './sampleText';
import Tab from './tab';

export interface State
extends EventTarget<State.Event>
{
    content: string;
    tabs: (typeof Tab)[];
}

export namespace State
{
    export enum Event
    {
        ContentChange = 'contentchange',
        TabChange = 'tabchange'
    }
}

export const state: State =
{
    addEventListener,
    removeEventListener,
    dispatchEvent,
    
    content: sampleText,
    tabs: []
}

export default state;