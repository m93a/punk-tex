import * as React from 'react';
import { State } from '../state';

export { default as Editor } from './Editor';
export { default as Preview } from './Preview';
export { default as References } from './ReferenceManager';
export { default as Equations } from './Equations';
export { default as DataManager } from './DataManager';

import {Editor, Preview, References, Equations, DataManager} from '.';
export const available: (typeof Tab)[] = [Editor, Preview, References, Equations, DataManager];

abstract class Tab extends React.Component<Tab.Props>
{
    public static get title(): string {
        throw Error('Tab.title is an abstract property that cannot be accessed on base class');
    }
}

namespace Tab
{
    export interface Props
    {
        state: State;
    }
}

export default Tab;