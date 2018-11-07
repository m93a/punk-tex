// Global
import * as React from 'react';
import './styles/App.css';
import state, { AppState } from './state';

import Tab, * as Tabs     from './tab';
import Session from './session';
import NotificationManager from './NotificationManager';
import WorkspaceNav from './WorkspaceNav';
import { default as Header, Header as HeaderC } from './Header';

import * as Grid from 'react-grid-layout';
const GridLayout = Grid.WidthProvider(Grid);

// CSS imports
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import TabAddButton from './TabAddButton';
import Window from './components/Window';

state.tabs = [Tabs.Editor, Tabs.Preview];

export interface ExtendedLayout
extends Grid.Layout {
  type: typeof Tab;
}

const defaultLayout: ExtendedLayout[][] = [
  [
    { i: 'RefPreview', type: Tabs.ReferencePreview, x: 0, y: 0, w: 4, h: 1 },
    { i: 'EqnPreview', type: Tabs.EquationPreview,  x: 4, y: 0, w: 3, h: 1 },
    { i: 'Editor',     type: Tabs.Editor,           x: 0, y: 1, w: 5, h: 7 },
    { i: 'Preview',    type: Tabs.Preview,          x: 5, y: 1, w: 7, h: 8 },
  ],
  [
    { i: 'DataManager', type: Tabs.DataManager, x: 0, y: 0, w: 6, h: 4 },
    { i: 'References',  type: Tabs.References,  x: 6, y: 0, w: 6, h: 4 },
  ],
  [
    { i: 'Equations', type: Tabs.EquationManager, x: 0, y: 0, w: 5, h: 4 },
  ],
];

class App extends React.Component<{}, App.State>
{
  private header?: HeaderC = undefined;
  public state = {
    layout: defaultLayout,
    unlocked: false,
  } as App.State;

  private setHeader = (h: HeaderC) => {
    this.header = h;
  }

  private switchWorkspace = (a: any, v: number) => {
    state.workspace = v;
    this.forceUpdate();
  }

  private toggleLock = () => this.setState({ unlocked: !this.state.unlocked });

  public render()
  {
    const workspaces = this.state.layout;
    // <Navigation/>
    return (
      <div className="App">
        <Header innerRef={this.setHeader}/>
        <GridLayout
          isDraggable={this.state.unlocked}
          isRearrangeable={this.state.unlocked}
          isResizable={this.state.unlocked}
          className='layout'
          layout={defaultLayout[state.workspace]}
          margin={[10, 10]}
          style={{
            marginBottom: '56px',
          }}
        >
        {workspaces[state.workspace].map(T => (
          <Window
            id={T.i}
            key={T.i}
          >
            <T.type
              state={state}
            />
          </Window>
        ))}
        </GridLayout>
        <TabAddButton/>
        <WorkspaceNav
          unlocked={this.state.unlocked}
          state={state}
          onSwitchWorkspace={this.switchWorkspace}
          onToggleLock={this.toggleLock}
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
    layout: ExtendedLayout[][];
    unlocked: boolean;
  }
}

export default App;
