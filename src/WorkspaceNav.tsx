import * as React from 'react';
import * as Material from '@material-ui/core';
import { AppState } from './state';

import Receipt from '@material-ui/icons/Receipt';
import InsertChart from '@material-ui/icons/InsertChart';
import Explicit from '@material-ui/icons/Explicit';

class WorkspaceNav
extends React.Component<WorkspaceNav.Props, WorkspaceNav.State> {
    private onChange = (e: any, v: number) => {
        if (v === 3) {
            this.props.onToggleLock && this.props.onToggleLock();
            return;
        }
        this.props.onSwitchWorkspace && this.props.onSwitchWorkspace(e, v);
    }

    public render() {
        return (
            <Material.BottomNavigation
                showLabels
                value={this.props.state.workspace}
                onChange={this.onChange}
                style={{
                    position: 'fixed',
                    bottom: '0',
                    width: '100%',
                    backgroundColor: '#EEEEEE',
                }}
            >
                <Material.BottomNavigationAction
                    label="Document"
                    icon={<Receipt/>}
                />
                <Material.BottomNavigationAction
                    label="Data"
                    icon={<InsertChart/>}
                />
                <Material.BottomNavigationAction
                    label="Math"
                    icon={<Explicit/>}
                />
                <Material.BottomNavigationAction
                    label="Lock workspace"
                    icon={<Explicit/>}
                />
            </Material.BottomNavigation>
        );
    }
}

namespace WorkspaceNav {
    export interface Props {
        state: AppState;
        onToggleLock?(): void;
        onSwitchWorkspace?(event: any, index: number): void;
    }

    export interface State {
    }
}

export default WorkspaceNav;