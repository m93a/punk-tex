import * as React from 'react';
import * as Material from '@material-ui/core';
import * as _ from 'lodash';

interface Notification {
    id: string;
    text: string;
    timeout?: number;
    closing?: boolean;
}


class NotificationManager
extends React.Component<NotificationManager.Props, NotificationManager.State> {
    private static Listeners: ((n: Notification) => void)[] = [];

    public static push(text: string, timeout?: number) {
        const id = _.uniqueId('ntf-');
        const notification = {
            id,
            text,
            timeout,
        }
        this.Listeners.forEach(l => l(notification));
    }

    public state = {
        notifications: []
    } as NotificationManager.State;

    public componentDidMount() {
        NotificationManager.Listeners.push(this.update);
    }

    public componentWillUnmount() {
        NotificationManager.Listeners.splice(NotificationManager.Listeners.indexOf(this.update), 1);
    }

    private handleRemove = (id: string) => {
        this.state.notifications.splice(0, 1);
        this.forceUpdate();
    }

    private handleClose = (id: string) => {
        if (this.state.notifications.length > 0) {
            this.state.notifications[0].closing = true;
            this.forceUpdate();
        }
    }

    private update = (n: Notification) => {
        this.state.notifications.push(n);
        this.forceUpdate();
    }

    public render() {
        const ntfs = this.state.notifications;
        const n = ntfs.length > 0 ? ntfs[0] : undefined;
        return (
            <span id='notification-manager'>
            {n && (
                <NotificationManager.Item
                    onRemove={this.handleRemove}
                    onClose={this.handleClose}
                    {...n}
                />
            )}
            </span>
        );
    }
}

namespace NotificationManager {
    export interface Props {

    }

    export interface State {
        notifications: Notification[];
    }

    export class Item
    extends React.Component<Notification & {
        id: string;
        onClose?(id: string): void;
        onRemove?(id: string): void;
    }> {
        private onClose = () => {
            this.props.onClose && this.props.onClose(this.props.id);
        }

        private onRemove = () => {
            this.props.onRemove && this.props.onRemove(this.props.id);
        }

        public render() {
            const { id, text, timeout } = this.props;
            return (
                <Material.Snackbar
                    anchorOrigin={{
                        horizontal: 'left',
                        vertical: 'bottom'
                    }}
                    id={id}
                    open={!this.props.closing}
                    onClose={this.onClose}
                    onExited={this.onRemove}
                    autoHideDuration={timeout || 6000}
                    message={(
                        <span>{text}</span>
                    )}
                />
            );
        }
    }
}

(window as any).NotificationManager = NotificationManager;

export default NotificationManager;