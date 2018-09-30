// Global
import * as React from 'react';
import './App.css';
// import './math.css';
import logo from './logo.svg';


import Navigation from './Navigation';
import state, { State } from './state';

import Tab        from './tab';
import Editor     from './tab/Editor';
import Preview    from './tab/Preview';
import References from './tab/ReferenceManager';


const availableTabs: (typeof Tab)[] = [Editor, Preview, References];

state.tabs = [Editor, Preview];

class App extends React.Component
{
  public render()
  {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-title">
            <img src={logo} className="App-logo" alt="logo" />
            <span className="punkTEX">
              <span className="punkTEX-punk">punk</span>
              <span className="punkTEX-TEX">T<span className="punkTEX-E">E</span>X</span>
            </span>
            <span>v0.1-beta</span>
          </div>

          <Navigation
            columns={2}
            state={state}
            tabs={availableTabs}
          />
        </header>
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
