import * as React from 'react';
import { AppState } from './state';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Receipt from '@material-ui/icons/Receipt';
import InsertChart from '@material-ui/icons/InsertChart';
import Explicit from '@material-ui/icons/Explicit';
import Lock from '@material-ui/icons/Lock';
import LockOpen from '@material-ui/icons/LockOpen';

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
            <BottomNavigation
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
                <BottomNavigationAction
                    label="Document"
                    icon={<Receipt/>}
                />
                <BottomNavigationAction
                    label="Data"
                    icon={<InsertChart/>}
                />
                <BottomNavigationAction
                    label="Math"
                    icon={<Explicit/>}
                />
                <Material.BottomNavigationAction
                    label={this.props.unlocked ? "Lock workspace" : "Unlock workspace"}
                    icon={this.props.unlocked ? <Lock/> : <LockOpen/>}
                />
            </BottomNavigation>
        );
    }
}

namespace WorkspaceNav {
    export interface Props {
        unlocked: boolean;

        state: AppState;
        onToggleLock?(): void;
        onSwitchWorkspace?(event: any, index: number): void;
    }

    export interface State {
    }
}

export default WorkspaceNav;