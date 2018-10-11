import * as React from 'react';
import { FaCaretLeft, FaCaretDown, FaCaretRight } from 'react-icons/fa';
import { State } from './state';
import Tab from './tab';


namespace Navigation
{
    export interface Props
    {
        tabs: (typeof Tab)[];
        state: State,
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
    private callbackCache = new Map<typeof Tab, Map<number, () => void>>();
    private universalCallback = this.props.onTabClick;

    /**
     * Factory for callback functions
     */
    private clickCallback(tab: typeof Tab, col: number)
    {
        const state = this.props.state;

        const changeTab = () =>
        {
            state.tabs[col] = tab;
            state.dispatchEvent(State.Event.TabChange, { source: this });
        }


        if (this.universalCallback !== this.props.onTabClick)
        {
            this.universalCallback = this.props.onTabClick;
            this.callbackCache = new Map();
        }

        const fn = this.universalCallback || (() => void 0);
        let submap = this.callbackCache.get(tab);

        if (!submap)
        {
            submap = new Map();
            this.callbackCache.set(tab, submap);
        }

        let callback = submap.get(col);

        if (!callback)
        {
            callback = () =>
            {
                fn(col, tab);
                changeTab();
            }
            submap.set(col, callback);
        }

        return callback;
    }

    public render()
    {
        const entries: React.ReactChild[] = [];

        for (const tab of this.props.tabs)
        {
            const buttons: React.ReactChild[] = [];
            const l = this.props.columns;

            for (let col = 0; col < l; col++)
            {
                let Caret; 

                if (col === 0)        Caret = FaCaretLeft;
                else if (col === l-1) Caret = FaCaretRight;
                else                  Caret = FaCaretDown;
                
                buttons[col] = <button key={col} onClick={this.clickCallback(tab, col)}><Caret /></button>
            }

            entries.push(
                <div key={tab.title} className="App-tab-button">
                    <span className="title">{tab.title}</span>
                    {buttons}
                </div>
            );
        }
        
        return <nav className="App-navigation">{entries}</nav>;
    }
}

export default Navigation;