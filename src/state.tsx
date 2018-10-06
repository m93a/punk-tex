import { EventTarget, addEventListener, removeEventListener, dispatchEvent } from './event';
import sampleText from './sampleText';
import Tab from './tab';
import Reference from './Reference';
import sampleReferences from './sampleReferences';

export interface State
extends EventTarget<State.Event>
{
    tabs: (typeof Tab)[];
    content: string;
    references: Reference.Params[];
}

export namespace State
{
    export enum Event
    {
        ContentChange = 'contentchange',
        TabChange = 'tabchange',
        ReferencesChange = 'referenceschange'
    }
}

export const state: State =
{
    addEventListener,
    removeEventListener,
    dispatchEvent,

    tabs: [],
    content: sampleText,
    references: sampleReferences
}

export default state;