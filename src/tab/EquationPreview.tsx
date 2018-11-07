import * as React from 'react';
import Tab from './Tab';
import EquationManager from './Equations';

class ReferencePreview extends Tab
{
    public static get title() { return 'ReferencePreview'; }

    public render()
    {
        return <EquationManager state={this.props.state} preview />
    }
}

export default ReferencePreview;