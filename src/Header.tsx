import * as React from 'react';
import * as Material from '@material-ui/core';

// Icons
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Add from '@material-ui/icons/Add';

class Header
extends React.Component<Header.Props, Header.State> {
    public render() {
        // logo
        

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
                        <span className="punkTeX-punk">
                            <span className="punkTeX-p">p</span>
                            <span className="punkTeX-u">u</span>
                            <span className="punkTeX-n">n</span>
                            <span className="punkTeX-k">k</span>
                        </span>
                        <span className="TeX">T<span className="TeX-e">E</span>X</span>
                    </Material.Typography>
                    <Material.IconButton color='inherit'>
                        <Add/>
                    </Material.IconButton>
                    <Material.IconButton color='inherit'>
                        <AccountCircle/>
                    </Material.IconButton>
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

    }
}

export default Header;