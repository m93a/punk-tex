import * as React from 'react';
import Tab from './Tab';
import { Quantity } from './Quantities';
import { state } from '../state';

import * as parseDecimal from 'parse-decimal-number';
import { LambdaCache, hashObject } from 'src/lib/react-helpers';

import
{
    Paper, Grid, Button, Typography,
    List, ListItem, ListItemText,
    Table, TableBody, TableHead, TableRow, TableCell,
    Dialog, DialogTitle, DialogContent, DialogActions
}
from '@material-ui/core';

import { FaCog } from "react-icons/fa";


export interface Data
{
    id: string;
    name: string;
    columns: DataColumn[];
}

export interface DataColumn
{
    quantity: Quantity | null;
    values: (number|string)[];
}
interface ModalsState
{
    openColumnSettings: DataColumn | undefined;
}



class DataManager extends Tab
{
    public static get title() { return 'Data' };

    private cacheOrRetrieve = LambdaCache();

    private tableMaker = new TableMaker(this);

    public modals: ModalsState = {
        openColumnSettings: undefined
    }


    public render()
    {
        return <Grid container
            direction="row"
            spacing={8}
            alignItems="stretch"
            style={{height:"100%", width:"100%"}}
            onPaste={this.onPaste}
        >
            <Grid item xs={2}>
                <Paper square style={{height:"100%", overflow:"hidden"}}>
                    <List>
                        {this.renderMenu()}
                    </List>
                </Paper>
            </Grid>
            <Grid item
                xs={10}
                style={{
                    padding:"20px",
                    height: "100%",
                    overflow: "scroll"
                }}
            >
                {this.renderTable()}
            </Grid>
        </Grid>;
    }

    private renderMenu()
    {
        const arr: React.ReactChild[] = [];

        for (const table of state.tables.values())
        {
            arr.push(
                <ListItem
                    button
                    selected={state.editingTable === table.id}
                    onClick={this.cacheOrRetrieve('menu-click', table.id, () => {
                        state.editingTable = table.id;
                        this.forceUpdate();
                    })}
                >
                    <ListItemText
                        primary={table.name}
                        secondary={`[${table.id}]`}
                    />
                </ListItem>
            );
        }

        return arr;
    }

    private renderTable()
    {
        if (state.tables.has(state.editingTable!))
        {
            const table = state.tables.get(state.editingTable!)!;

            return this.tableMaker.render(table);
        }
        else return (
            <div>
                Vložte tabulku z Excelu pomocí Ctrl+V
            </div>
        );
    }

    public onPaste = (e: React.ClipboardEvent) =>
    {
        state.tables.set('pasted', dataFromHtml(e.clipboardData.getData('text/html')));
        state.editingEquation = 'pasted';
        this.forceUpdate();
    }
}

export default DataManager;



function dataFromHtml(src: string): Data
{
    const data: Data = {
        id: 'pasted',
        name: 'Vložená tabulka',
        columns: []
    };

    const arr = data.columns;

    const doc = (new DOMParser()).parseFromString(src, 'text/html');
    const table: HTMLElement = doc.getElementsByTagName('table')[0];

    let i = 0;
    for (const tr of table.getElementsByTagName('tr'))
    {
        let j = 0;

        for (const td of tr.getElementsByTagName('td'))
        {
            let value: number | string = parseDecimal(td.innerText,' ,');
            if (isNaN(value)) value = td.innerText;

            arr[j] = arr[j] || {quantity: null, values: []};
            arr[j].values[i] = value;
            j++;
        }

        i++;
    }

    return data;
}


export class TableMaker
{
    private cacheOrRetrieve = LambdaCache();
    private ref: DataManager;

    constructor(ref: DataManager)
    {
        this.ref = ref;
    }

    public render(data: Data)
    {
        return <Table>
            { this.renderHead(data) }
            { this.renderBody(data) }
            { this.renderDialog() }
        </Table>
    }

    public renderHead(data: Data)
    {
        return <TableHead>
            { data.columns.map( col => this.renderHeading(col)) }
        </TableHead>
    }

    public renderHeading(col: DataColumn)
    {
        return <TableCell component="th" key={hashObject(col)}>
            {col.quantity ? col.quantity.name : "[veličina]"}{" "}
            <FaCog className="icon button" onClick={this.cacheOrRetrieve(col, this.ref.modals, () => { this.ref.modals.openColumnSettings = col; this.ref.forceUpdate() })} /> {/* Yes I can make a line this long. */}
        </TableCell>;
    }

    public renderBody(data: Data)
    {
        const columns = data.columns;
        const rowArr: React.ReactChild[] = [];

        for (let row = 0 ;; row++)
        {
            const colArr = columns.map(col => this.renderCell(col, row));

            rowArr.push(<TableRow>{colArr}</TableRow>);

            if (columns.every(col => col.values.length <= row)) break;
        }

        return <TableBody>
            { rowArr }
        </TableBody>
    }

    public renderCell(col: DataColumn, rowIndex: number)
    {
        return (
            <TableCell
                contentEditable
                key={`${hashObject(col)}[${rowIndex}]`}
            >
                {col.values[rowIndex]}

            </TableCell>
        );
    }

    public renderDialog()
    {
        const modals = this.ref.modals;

        if (!modals.openColumnSettings) return;

        return (
            <ColumnSettings
                col={modals.openColumnSettings}
                onClose={this.cacheOrRetrieve(
                    modals, () => {
                        modals.openColumnSettings = undefined;
                        this.ref.forceUpdate();
                    }
                )}
            />
        );
    };


}

export namespace Table
{
    export interface Props
    {
        data: Data;
    }
}


namespace ColumnSettings
{
    export interface Props
    {
        col: DataColumn;
        onClose: () => void;
    }
}
class ColumnSettings
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