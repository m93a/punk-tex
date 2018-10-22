import * as React from 'react';
import * as Material from '@material-ui/core';

// Icons
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Add from '@material-ui/icons/Add';
import { Logo } from './components';

class Header
extends React.Component<Header.Props, Header.State> {
    public state = {
        isOpen: {
            'add':  undefined,
            'user': undefined,
        }
    };

    private openMenu = (menu: string) => {
        return (e: React.MouseEvent<HTMLElement>) => {
            this.state.isOpen[menu] = e.currentTarget;
            this.forceUpdate();
        };
    }

    private closeMenu = (menu: string) => {
        return (e: React.MouseEvent<HTMLElement>) => {
            this.state.isOpen[menu] = undefined;
            this.forceUpdate();
        };
    }

    public render() {
        return (
            <Material.AppBar position='relative'>
                <Material.Toolbar>
                    <Material.IconButton
                        color='inherit'
                        style={{
                            marginLeft: -12,
                            marginRight: 20,
                        }}
                        onClick={this.props.toggleNav}
                    >
                        <MenuIcon/>
                    </Material.IconButton>
                    <Material.Typography variant='h6' className="punkTeX" color='inherit' style={{
                        textAlign: 'left',
                        flexGrow: 1,
                    }}>
                        <Logo/>
                    </Material.Typography>
                    <div>
                        <Material.IconButton
                            color='inherit'
                            onClick={this.openMenu('add')}
                        >
                            <Add/>
                        </Material.IconButton>
                        <Material.Menu
                            open={Boolean(this.state.isOpen['add'])}
                            anchorEl={this.state.isOpen['add']}
                            onClose={this.closeMenu('add')}
                        >
                            <Material.MenuItem>New project</Material.MenuItem>
                        </Material.Menu>
                    </div>
                    <div>
                        <Material.IconButton
                            color='inherit'
                            onClick={this.openMenu('user')}
                        >
                            <AccountCircle/>
                        </Material.IconButton>
                        <Material.Menu
                            open={Boolean(this.state.isOpen['user'])}
                            anchorEl={this.state.isOpen['user']}
                            onClose={this.closeMenu('user')}
                        >
                            <Material.MenuItem>Login</Material.MenuItem>
                        </Material.Menu>
                    </div>
                </Material.Toolbar>
            </Material.AppBar>
        )
    }
}

namespace Header {
    export interface Props {
        toggleNav?(): void;
    }

    export interface State {
        isOpen: {
            [menu: string]: Element | undefined;
        };
    }
}

export default Header;