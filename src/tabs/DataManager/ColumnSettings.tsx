import * as React from 'react';
import { DataColumn } from '.';
import { Iterable } from 'src/lib/react-helpers';

import
{
    Button, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Select, InputLabel, MenuItem
}
from '@material-ui/core';
import { state } from 'src/state';


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
        const quantity = this.props.col.quantity;
        const equation = this.props.col.equation;

        return (
          <Dialog open onClose={this.props.onClose}>
            <DialogTitle>
                Nastavení sloupce {quantity ? quantity.name : '[veličina]'}
            </DialogTitle>
            <DialogContent>
                <InputLabel htmlFor="qty">Veličina: </InputLabel>
                <Select
                    value={quantity ? quantity.id : undefined}
                    onChange={this.onColumnQuantityChange}
                    name="qty"
                >
                    <MenuItem value={undefined}>
                        <em>[žádná]</em>
                    </MenuItem>

                    {
                        Array.from(
                            Iterable.map( state.project.quantities.values(), qty =>
                                <MenuItem value={qty.id}>{qty.name}</MenuItem>
                            )
                        )
                    }

                </Select>
                <InputLabel htmlFor="eqn">Rovnice: </InputLabel>
                <Select
                    value={equation ? equation.id : undefined}
                    onChange={this.onColumnEquationChange}
                    name="eqn"
                >
                    <MenuItem value={undefined}>
                        <em>[žádná]</em>
                    </MenuItem>

                    {
                        Array.from(
                            Iterable.map( state.project.equations.values(), eqn =>
                                quantity &&
                                eqn.lhs.trim() === quantity.id &&
                                <MenuItem value={eqn.id}>{eqn.id}</MenuItem>
                            )
                        )
                    }

                </Select>
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

    private onColumnQuantityChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    {
        const proj = state.project;
        const col = this.props.col;
        const qty = event.target.value;

        col.quantity
            = qty === undefined
            ? null
            : proj.quantities.has(qty)
            ? proj.quantities.get(qty)!
            : null;

        col.quantity &&
        col.equation &&
        col.equation.lhs !== col.quantity.id &&
        (col.equation = null);

        this.forceUpdate();
    }

    private onColumnEquationChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    {
        const proj = state.project;
        const col = this.props.col;
        const eqn = event.target.value;

        col.equation
            = eqn === undefined
            ? null
            : proj.equations.has(eqn)
            ? proj.equations.get(eqn)!
            : null;

        this.forceUpdate();
    }
}