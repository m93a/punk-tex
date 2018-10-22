import * as React from 'react';
import { State } from '../state';
import { SvgIcon } from '@material-ui/core';
import * as Icons from '@material-ui/icons';

abstract class Tab extends React.Component<Tab.Props>
{
    public static get title(): string {
        throw Error('Tab.title is an abstract property that cannot be accessed on base class');
    }

    public static get icon(): typeof SvgIcon {
        return Icons.Tab;
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