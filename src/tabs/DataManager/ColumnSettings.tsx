import * as React from 'react';
import { DataColumn } from '.';

import
{
    Button, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions
}
from '@material-ui/core';


export namespace ColumnSettings
{
    export interface Props
    {
        col: DataColumn;
        onClose: () => void;
    }
}

export class ColumnSettings
extends React.Component<ColumnSettings.Props>
{
    public render()
    {
        return (
          <Dialog open onClose={this.props.onClose}>
              <DialogTitle>
                Nastavení sloupce {this.props.col.quantity!.name || '[veličina]'}
              </DialogTitle>
              <DialogContent>
                <Typography gutterBottom>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
                    facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum
                    at eros.
                </Typography>
                <Typography gutterBottom>
                    Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                    lacus vel augue laoreet rutrum faucibus dolor auctor.
                </Typography>
                <Typography gutterBottom>
                    Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                    scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                    auctor fringilla.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.props.onClose} color="primary">
                    OK
                </Button>
              </DialogActions>
          </Dialog>
        );
    }
}