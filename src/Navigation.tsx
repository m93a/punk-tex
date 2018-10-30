import * as React from 'react';
import { LambdaCache } from './lib/react-helpers';
import { AppState } from './state';
import * as Material from '@material-ui/core';

import { default as Tab, available } from './tab';

const styles = (theme: Material.Theme) => Material.createStyles({
    drawerPaper: {
      width: 240,
      [theme.breakpoints.up('md')]: {
        position: 'relative',
      },
    },
});


namespace Navigation
{
    export interface Props
    extends Material.WithStyles<typeof styles>
    {
        open?: boolean;
        toggleNav?(): void;

        state: AppState,
        columns: number,
        onTabClick?: (col: number, tab: typeof Tab) => void
    }
}

class Navigation extends React.Component<Navigation.Props>
{
    /**
     * Creating new lambdas in the render method causes unnecessary rerendering.
     * I'll save the callbacks for the click event for specific buttons here, so
     * that I pass the same lambdas to React once I create them.
     */
    private cacheOrRetrieve = LambdaCache();

    /**
     * Factory for callback functions
     */
    // @ts-ignore
    private clickCallback(tab: typeof Tab, col: number)
    {
        const state = this.props.state;

        const callback = () =>
        {
            // If there's a React-style event listener, call it
            this.props.onTabClick
            && this.props.onTabClick(col, tab);

            // Change the tab
            state.tabs[col] = tab;
            state.dispatchEvent(AppState.Event.TabChange, { source: this });
        }

        return this.cacheOrRetrieve(tab, col, callback);
    }

    public render()
    {
        const entries: React.ReactChild[] = [];

        for (const tab of available)
        {
            entries.push(
                <Material.ListItem key={tab.title} button>
                    <Material.ListItemIcon><tab.icon/></Material.ListItemIcon>
                    <Material.ListItemText>{tab.title}</Material.ListItemText>
                </Material.ListItem>
            );
        }
        return (
            <Material.Drawer
                open={this.props.open}
                variant='temporary'
                classes={{ paper: this.props.classes.drawerPaper }}
                onClose={this.props.toggleNav}
            >
                <Material.List>
                {entries}
                </Material.List>
            </Material.Drawer>
        );
    }
}

export default Material.withStyles(styles)(Navigation);