import * as React from 'react';

// Material
import withStyles from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { Theme } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Add from '@material-ui/icons/Add';
import Save from '@material-ui/icons/Save';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


import { Logo } from './components';
import Session from './session';
import state, { AppState, setProject } from './state';
import Project from './project';
import FS from './filesystem';

interface Menu {
    icon: typeof SvgIcon;
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

const styles = (theme: Theme) => createStyles({
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

    private _fileElement: HTMLInputElement | undefined;
    private setFileRef = (el: HTMLInputElement) => this._fileElement = el;
    public openFileDialog = () => this._fileElement!.click();
    public onLoadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files!.item(0)!;
        e.target.value = null as any;
        setProject(await FS.loadProject(file));
    }

    private menus: Menus = {
        add: {
            icon: Add,
            items: [
                { title: 'New Project', action: () => setProject(new Project()) },
                { title: 'Load Project', action: this.openFileDialog },
            ]
        },
        save: {
            icon: Save,
            items: [
                { title: 'Save', action: async () => FS.saveAs(await FS.archive(state.project), "project.zip") }
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
            <AppBar position='relative'>
                <Toolbar>
                    <Typography variant='h6' className="punkTeX" color='inherit' style={{
                        textAlign: 'left',
                        flexGrow: 1,
                    }}>
                        <Logo/>
                    </Typography>
                    {
                        Object.keys(this.menus).map(_m => {
                            const m = this.menus[_m];
                            return (
                                <div key={_m}>
                                    <IconButton
                                        color='inherit'
                                        onClick={this.openMenu(_m)}
                                    >
                                        <m.icon/>
                                    </IconButton>
                                    <Menu
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
                                                        <MenuItem
                                                            key={item.title}
                                                            onClick={item.action}
                                                        >
                                                        {item.title}
                                                        </MenuItem>
                                                    );
                                                }
                                            }
                                            return nodes;
                                        })()
                                    }
                                    </Menu>
                                </div>
                            );
                        })
                    }
                </Toolbar>
                <Header.LoginDialog
                    open={this.state.modal === 'login'}
                    onClose={this.closeModal}
                />
                <Header.RegisterDialog
                    open={this.state.modal === 'register'}
                    onClose={this.closeModal}
                />
                <input
                    type='file'
                    ref={this.setFileRef}
                    style={{ display: 'none' }}
                    onChange={this.onLoadFile}
                />
            </AppBar>
        );
    }
}

export namespace Header {
    export interface Props {
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
                <Dialog
                    open={this.props.open}
                    onClose={this.props.onClose}
                >
                    <DialogTitle>
                    Log in to your account
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            id='email'
                            label='E-mail'
                            type='email'
                            value={this.state.email}
                            onChange={this.handleChange}
                            fullWidth
                        />
                        <TextField
                            id='password'
                            label='Password'
                            type='password'
                            value={this.state.password}
                            onChange={this.handleChange}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color='primary'
                            onClick={this.login}
                        >
                            Login
                        </Button>
                        <Button
                            onClick={this.props.onClose}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
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
                <Dialog
                    open={this.props.open}
                    onClose={this.props.onClose}
                >
                    <DialogTitle>
                    Register a new account
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            id='email'
                            label='E-mail'
                            type='email'
                            value={this.state.email}
                            onChange={this.handleChange}
                            fullWidth
                        />
                        <TextField
                            id='password'
                            label='Password'
                            type='password'
                            value={this.state.password}
                            onChange={this.handleChange}
                            fullWidth
                        />
                        <TextField
                            id='confirmPassword'
                            label='Confirm password'
                            type='password'
                            value={this.state.password}
                            onChange={this.handleChange}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color='primary'
                        >
                            Register
                        </Button>
                        <Button
                            onClick={this.props.onClose}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
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

export default withStyles(styles)(Header);