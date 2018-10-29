// Global
import * as React from 'react';
import './styles/App.css';
import state, { State } from './state';

import * as Tabs     from './tab';
import Navigation from './Navigation';
import Session from './session';
import NotificationManager from './NotificationManager';
import { default as Header, Header as HeaderC } from './Header';

state.tabs = [Tabs.Editor, Tabs.Preview];

class App extends React.Component<{}, App.AppState>
{
  private header?: HeaderC = undefined;
  public state = {
    navOpen: false,
  } as App.AppState;

  private toggleNav = () => {
    this.setState({ navOpen: !this.state.navOpen });
  }

  private setHeader = (h: HeaderC) => {
    this.header = h;
  }

  public render()
  {
    // <Navigation/>
    return (
      <div className="App">
        <Header toggleNav={this.toggleNav} innerRef={this.setHeader}/>
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
        <NotificationManager/>
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
    this.checkLogin();
  }

  public componentWillUnmount()
  {
    state.removeEventListener(State.Event.TabChange, this.update);
  }

  private checkLogin = async () => {
    let token = localStorage.getItem('token');
    if (token) {
      try {
        token = await Session.refreshToken(token);
        NotificationManager.push('Logged in using your previous token.');
      } catch (err) {
        localStorage.removeItem('token');
        NotificationManager.push('Your previous token vas not valid.', {
          text: 'Login again',
          onClick: (() => {
            this.header && this.header.openLogin();
          }).bind(this)
        });
        return;
      }
      state.token = token;
      state.dispatchEvent(State.Event.LoginStateChange);
      localStorage.setItem('token', token);
    }
  }
}

namespace App {
  export interface AppState {
    navOpen: boolean;
  }
}

export default App;
