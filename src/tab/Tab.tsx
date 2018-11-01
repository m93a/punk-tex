import * as React from 'react';
import { AppState } from '../state';
import SvgIcon from '@material-ui/core/SvgIcon';
import TabIcon from '@material-ui/icons/Tab';

abstract class Tab extends React.Component<Tab.Props>
{
    public static get title(): string {
        throw Error('Tab.title is an abstract property that cannot be accessed on base class');
    }

    public static get icon(): typeof SvgIcon {
        return TabIcon;
    }
}

namespace Tab
{
    export interface Props
    {
        state: AppState;
    }
}

export default Tab;