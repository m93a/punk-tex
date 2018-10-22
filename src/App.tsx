// Global
import * as React from 'react';
import './styles/App.css';
import state, { State } from './state';

import * as Tabs     from './tab';
import Header from './Header';

state.tabs = [Tabs.Editor, Tabs.Preview];

class App extends React.Component
{
  public render()
  {
    // <Navigation/>
    return (
      <div className="App">
        <Header/>
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

export default App;
