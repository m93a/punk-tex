// Global
import * as React from 'react';
import './styles/App.css';
// import './math.css';
import logo from './styles/logo.svg';


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
            <span className="punkTeX">
              <span className="punkTeX-punk">
                <span className="punkTeX-p">p</span>
                <span className="punkTeX-u">u</span>
                <span className="punkTeX-n">n</span>
                <span className="punkTeX-k">k</span>
              </span>
              <span className="TeX">T<span className="TeX-e">E</span>X</span>
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
