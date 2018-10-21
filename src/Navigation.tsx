import * as React from 'react';
import { FaCaretLeft, FaCaretDown, FaCaretRight } from 'react-icons/fa';
import { LambdaCache } from './lib/react-helpers';
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
    private cacheOrRetrieve = LambdaCache();

    /**
     * Factory for callback functions
     */
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
            state.dispatchEvent(State.Event.TabChange, { source: this });
        }

        return this.cacheOrRetrieve(tab, col, callback);
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