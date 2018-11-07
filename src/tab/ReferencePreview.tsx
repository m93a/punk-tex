import * as React from 'react';
import Tab from './Tab';
import ReferenceManager from './References';
import FormatQuote from '@material-ui/icons/FormatQuote';

class ReferencePreview extends Tab
{
    public static get title() { return 'ReferencePreview'; }
    public static get icon() { return FormatQuote; }

    public render()
    {
        return <ReferenceManager state={this.props.state} preview />
    }
}

export default ReferencePreview;