import * as React from 'react';
import * as Material from '@material-ui/core';

import Add from '@material-ui/icons/Add';

class TabAddButton
extends React.Component<TabAddButton.Props, TabAddButton.State> {
    public render() {
        return (
            <Material.Button
                variant='fab'
                style={{
                zIndex: 10000,
                position: 'fixed',
                right: '24px',
                bottom: '72px',
                }}
                color='secondary'
            >
                <Add/>
            </Material.Button>
        );
    }
}

namespace TabAddButton {
    export interface Props {
    }

    export interface State {
    }
}

export default TabAddButton;