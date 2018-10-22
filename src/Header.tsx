import * as React from 'react';
import * as Material from '@material-ui/core';

class Header
extends React.Component<Header.Props, Header.State> {
    public render() {
        // logo
        

        return (
            <Material.AppBar>
                <Material.Toolbar>
                    <span className="punkTeX">
                        <span className="punkTeX-punk">
                            <span className="punkTeX-p">p</span>
                            <span className="punkTeX-u">u</span>
                            <span className="punkTeX-n">n</span>
                            <span className="punkTeX-k">k</span>
                        </span>
                        <span className="TeX">T<span className="TeX-e">E</span>X</span>
                    </span>
                </Material.Toolbar>
            </Material.AppBar>
        )
    }
}

namespace Header {
    export interface Props {

    }

    export interface State {

    }
}

export default Header;