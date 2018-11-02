import * as React from 'react';

import Divider from '@material-ui/core/Divider';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
// import CardActions from '@material-ui/core/CardActions';

const styles = createStyles({
    root: {
        padding: 0,
        height: '100%',
        overflow: 'auto',
    }
});

class Window
extends React.Component<Window.Props, Window.State> {
    public render() {
        return (
            <Card
                {...this.props}
                classes={undefined}
            >
                <CardActionArea>
                    <div
                        style={{
                            backgroundColor: '#FAFAFA',
                            padding: '3px',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span><b>{this.props.id}</b></span>
                        <span>X</span>
                    </div>
                </CardActionArea>
                <Divider/>
                <CardContent
                    classes={this.props.classes}
                >
                {this.props.children}
                </CardContent>
            </Card>
        );
    }
}

namespace Window {
    export interface Props
    extends WithStyles<typeof styles> {
        id?: string;
        style?: React.CSSProperties;
    }

    export interface State {
    }
}

export default withStyles(styles)(Window);