// Global
import * as React from 'react';
import './styles/App.css';
import state, { State } from './state';

import * as Tabs     from './tab';
import Header from './Header';
import Navigation from './Navigation';

state.tabs = [Tabs.Editor, Tabs.Preview];

class App extends React.Component<{}, App.AppState>
{
  public state = {
    navOpen: false,
  } as App.AppState;

  private toggleNav = () => {
    this.setState({ navOpen: !this.state.navOpen });
  }

  public render()
  {
    // <Navigation/>
    return (
      <div className="App">
        <Header toggleNav={this.toggleNav}/>
        <Navigation 
          state={state}
          columns={2}
          open={this.state.navOpen}
          toggleNav={this.toggleNav}
        />
        <div className="App-intro">
          {
            state.tabs.map( (T, i) => <T key={i} state={state} />)
          }
        </div>
      </div>
    );
  }

  public update = () =>
  {
    this.forceUpdate();
  }

  public componentDidMount()
  {
    state.addEventListener(State.Event.TabChange, this.update);
  }

  public componentWillUnmount()
  {
    state.removeEventListener(State.Event.TabChange, this.update);
  }

}

namespace App {
  export interface AppState {
    navOpen: boolean;
  }
}

export default App;
