import * as React from 'react';
import * as Material from '@material-ui/core';

// Icons
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Add from '@material-ui/icons/Add';
import { Logo } from './components';
import Session from './session';
import state, { State as AppState } from './state';

interface Menu {
    icon: typeof Material.SvgIcon;
    items: Partial<{
        title: string;
        type: 'item' | 'delimiter'
        action: (e: React.MouseEvent<HTMLElement>) => void;
        visible: () => boolean;
    }> [];
};

interface Menus {
    add: Menu,
    user: Menu,
    [id: string]: Menu,
}

const styles = (theme: Material.Theme) => Material.createStyles({
    paper: {
      position: 'absolute',
      width: theme.spacing.unit * 50,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing.unit * 4,
    },
});

export class Header
extends React.Component<Header.Props, Header.State> {
    public state = {
        isOpen: {} as any,
        modal: undefined,
    };

    public componentDidMount() {
        state.addEventListener(AppState.Event.LoginStateChange, this.update);
    }

    public componentWillUnmount() {
        state.removeEventListener(AppState.Event.LoginStateChange, this.update);
    }

    private update = () => {
        this.forceUpdate();
    }

    public openLogin = () => {
        this.setState({ modal: 'login' });
    }

    private menus: Menus = {
        add: {
            icon: Add,
            items: [
                { title: 'New Project' }
            ]
        },
        user: {
            icon: AccountCircle,
            items: [
                {
                    title: 'Log in',
                    action: () => this.setState({ modal: 'login' }),
                    visible: () => !Boolean(state.token),
                },
                {
                    title: 'Register',
                    action: () => this.setState({ modal: 'register' }),
                    visible: () => !Boolean(state.token),
                },
                {
                    title: 'My profile',
                    action: () => this.setState({ modal: 'register' }),
                    visible: () => Boolean(state.token),
                },
                {
                    title: 'Log out',
                    action: () => {
                        state.token = undefined;
                        localStorage.removeItem('token');
                        state.dispatchEvent(AppState.Event.LoginStateChange);
                    },
                    visible: () => Boolean(state.token),
                },
            ]
        }
    };

    private openMenu = (menu: keyof Menus) => {
        return (e: React.MouseEvent<HTMLElement>) => {
            this.state.isOpen[menu] = e.currentTarget;
            this.forceUpdate();
        };
    }

    private closeMenu = (menu: keyof Menus) => {
        return (e: React.MouseEvent<HTMLElement>) => {
            this.state.isOpen[menu] = undefined;
            this.forceUpdate();
        };
    }

    private closeModal = () => this.setState({ modal: undefined });

    public render() {
        return (
            <Material.AppBar position='relative'>
                <Material.Toolbar>
                    <Material.IconButton
                        color='inherit'
                        style={{
                            marginLeft: -12,
                            marginRight: 20,
                        }}
                        onClick={this.props.toggleNav}
                    >
                        <MenuIcon/>
                    </Material.IconButton>
                    <Material.Typography variant='h6' className="punkTeX" color='inherit' style={{
                        textAlign: 'left',
                        flexGrow: 1,
                    }}>
                        <Logo/>
                    </Material.Typography>
                    {
                        Object.keys(this.menus).map(_m => {
                            const m = this.menus[_m];
                            return (
                                <div key={_m}>
                                    <Material.IconButton
                                        color='inherit'
                                        onClick={this.openMenu(_m)}
                                    >
                                        <m.icon/>
                                    </Material.IconButton>
                                    <Material.Menu
                                        open={Boolean(this.state.isOpen[_m])}
                                        anchorEl={this.state.isOpen[_m]}
                                        onClose={this.closeMenu(_m)}
                                    >
                                    {
                                        (() => {
                                            const nodes: React.ReactNode[] = [];
                                            for (const item of m.items) {
                                                if (!item.visible || item.visible()) {
                                                    nodes.push(
                                                        <Material.MenuItem
                                                            key={item.title}
                                                            onClick={item.action}
                                                        >
                                                        {item.title}
                                                        </Material.MenuItem>
                                                    );
                                                }
                                            }
                                            return nodes;
                                        })()
                                    }
                                    </Material.Menu>
                                </div>
                            );
                        })
                    }
                </Material.Toolbar>
                <Header.LoginDialog
                    open={this.state.modal === 'login'}
                    onClose={this.closeModal}
                />
                <Header.RegisterDialog
                    open={this.state.modal === 'register'}
                    onClose={this.closeModal}
                />
            </Material.AppBar>
        );
    }
}

export namespace Header {
    export interface Props {
        toggleNav?(): void;
    }

    export interface State {
        isOpen: {
            [menu in keyof Menus]: HTMLElement | undefined;
        };
        modal?: 'login' | 'register';
    }

    export class LoginDialog
    extends React.Component<LoginDialog.Props, LoginDialog.State> {
        public state = {
            email: '',
            password: '',
        }

        private handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            this.state[e.target.id] = e.target.value;
            this.forceUpdate();
        }

        private login = async () => {
            try {
                const token = await Session.getToken(this.state.email, this.state.password);
                state.token = token;
                state.dispatchEvent(AppState.Event.LoginStateChange);
                localStorage.setItem('token', token);

                this.props.onClose && this.props.onClose();
            } catch (err) {
                // TODO: show error
            }
        }

        public render() {
            return (
                <Material.Dialog
                    open={this.props.open}
                    onClose={this.props.onClose}
                >
                    <Material.DialogTitle>
                    Log in to your account
                    </Material.DialogTitle>
                    <Material.DialogContent>
                        <Material.TextField
                            id='email'
                            label='E-mail'
                            type='email'
                            value={this.state.email}
                            onChange={this.handleChange}
                            fullWidth
                        />
                        <Material.TextField
                            id='password'
                            label='Password'
                            type='password'
                            value={this.state.password}
                            onChange={this.handleChange}
                            fullWidth
                        />
                    </Material.DialogContent>
                    <Material.DialogActions>
                        <Material.Button
                            color='primary'
                            onClick={this.login}
                        >
                            Login
                        </Material.Button>
                        <Material.Button
                            onClick={this.props.onClose}
                        >
                            Cancel
                        </Material.Button>
                    </Material.DialogActions>
                </Material.Dialog>
            );
        }
    }

    export namespace LoginDialog {
        // tslint:disable-next-line:no-shadowed-variable
        export interface Props {
            open: boolean;
            onClose?(): void;
        }

        // tslint:disable-next-line:no-shadowed-variable
        export interface State {
            email: string;
            password: string;
        }
    }

    export class RegisterDialog
    extends React.Component<RegisterDialog.Props, RegisterDialog.State> {
        public state = {
            email: '',
            password: '',
            confirmPassword: '',
        }

        private handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            this.state[e.target.id] = e.target.value;
            this.forceUpdate();
        }

        public render() {
            return (
                <Material.Dialog
                    open={this.props.open}
                    onClose={this.props.onClose}
                >
                    <Material.DialogTitle>
                    Register a new account
                    </Material.DialogTitle>
                    <Material.DialogContent>
                        <Material.TextField
                            id='email'
                            label='E-mail'
                            type='email'
                            value={this.state.email}
                            onChange={this.handleChange}
                            fullWidth
                        />
                        <Material.TextField
                            id='password'
                            label='Password'
                            type='password'
                            value={this.state.password}
                            onChange={this.handleChange}
                            fullWidth
                        />
                        <Material.TextField
                            id='confirmPassword'
                            label='Confirm password'
                            type='password'
                            value={this.state.password}
                            onChange={this.handleChange}
                            fullWidth
                        />
                    </Material.DialogContent>
                    <Material.DialogActions>
                        <Material.Button
                            color='primary'
                        >
                            Register
                        </Material.Button>
                        <Material.Button
                            onClick={this.props.onClose}
                        >
                            Cancel
                        </Material.Button>
                    </Material.DialogActions>
                </Material.Dialog>
            );
        }
    }

    export namespace RegisterDialog {
        // tslint:disable-next-line:no-shadowed-variable
        export interface Props {
            open: boolean;
            onClose?(): void;
        }

        // tslint:disable-next-line:no-shadowed-variable
        export interface State {
            email: string;
            password: string;
            confirmPassword: string;
        }
    }
}

export default Material.withStyles(styles)(Header);