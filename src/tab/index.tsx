import * as React from 'react';
import { State } from '../state';

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