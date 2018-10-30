// Global
import * as React from 'react';
import './styles/App.css';
import state, { AppState } from './state';
import * as Material from '@material-ui/core';

import Tab, * as Tabs     from './tab';
import Navigation from './Navigation';
import Session from './session';
import NotificationManager from './NotificationManager';
import { default as Header, Header as HeaderC } from './Header';

import * as Grid from 'react-grid-layout';
const GridLayout = Grid.WidthProvider(Grid);

// CSS imports
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import WorkspaceNav from './WorkspaceNav';

state.tabs = [Tabs.Editor, Tabs.Preview];

export interface ExtendedLayout
extends Grid.Layout {
  type: typeof Tab;
}

const defaultLayout: ExtendedLayout[][] = [
  [
    { i: 'Editor', type: Tabs.Editor, x: 0, y: 0, w: 5, h: 8 },
    { i: 'Preview', type: Tabs.Preview, x: 5, y: 0, w: 7, h: 8 },
  ],
  [
    { i: 'DataManager', type: Tabs.DataManager, x: 0, y: 0, w: 6, h: 4 },
    { i: 'References', type: Tabs.References, x: 6, y: 0, w: 6, h: 4 },
  ],
  [
    { i: 'Equations', type: Tabs.Equations, x: 0, y: 0, w: 5, h: 4 },
  ],
];

class App extends React.Component<{}, App.State>
{
  private header?: HeaderC = undefined;
  public state = {
    navOpen: false,
    layout: defaultLayout,
  } as App.State;

  private toggleNav = () => {
    this.setState({ navOpen: !this.state.navOpen });
  }

  private setHeader = (h: HeaderC) => {
    this.header = h;
  }

  private switchWorkspace = (a: any, v: number) => {
    state.workspace = v;
    this.forceUpdate();
  }

  public render()
  {
    const workspaces = this.state.layout;
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
        <GridLayout
          className='layout'
          layout={defaultLayout[state.workspace]}
          margin={[10, 10]}
          style={{
            marginBottom: '56px',
          }}
        >
        {workspaces[state.workspace].map(T => (
          <Material.Paper
            key={T.i}
            style={{
              overflow: 'scroll',
            }}
          >
            <T.type
              state={state}
            />
          </Material.Paper>
        ))}
        </GridLayout>
        <WorkspaceNav
          state={state}
          onSwitchWorkspace={this.switchWorkspace}
        />
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
    state.addEventListener(AppState.Event.TabChange, this.update);
    this.checkLogin();
  }

  public componentWillUnmount()
  {
    state.removeEventListener(AppState.Event.TabChange, this.update);
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
      state.dispatchEvent(AppState.Event.LoginStateChange);
      localStorage.setItem('token', token);
    }
  }
}

namespace App {
  export interface State {
    navOpen: boolean;
    layout: ExtendedLayout[][];
  }
}

export default App;
