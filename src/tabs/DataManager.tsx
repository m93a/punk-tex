import * as React from 'react';
import Tab from './Tab';
import { Quantity } from './Quantities';
import { state } from '../state';

import * as parseDecimal from 'parse-decimal-number';
import { LambdaCache, hashObject } from 'src/lib/react-helpers';

import
{
    Paper, Grid,
    List, ListItem, ListItemText,
    Table, TableBody, TableHead, TableRow, TableCell
}
from '@material-ui/core';


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



class DataManager extends Tab
{
    public static get title() { return 'Data' };

    private cacheOrRetrieve = LambdaCache();

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

            return DataTable.render(table);
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


export class DataTable
{
    public static render(data: Data)
    {
        return <Table >
            { DataTable.renderHead(data) }
            { DataTable.renderBody(data) }
        </Table>
    }

    public static renderHead(data: Data)
    {
        return <TableHead>
            { data.columns.map(DataTable.renderHeading) }
        </TableHead>
    }

    public static renderHeading(col: DataColumn)
    {
        return <TableCell component="th" key={hashObject(col)}>
            {col.quantity ? col.quantity.name : "[veličina]"}
        </TableCell>;
    }

    public static renderBody(data: Data)
    {
        const columns = data.columns;
        const rowArr: React.ReactChild[] = [];

        for (let row = 0 ;; row++)
        {
            const colArr = columns.map(col => DataTable.renderCell(col, row));

            rowArr.push(<TableRow>{colArr}</TableRow>);

            if (columns.every(col => col.values.length <= row)) break;
        }

        return <TableBody>
            { rowArr }
        </TableBody>
    }

    public static renderCell(col: DataColumn, rowIndex: number)
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
}

export namespace Table
{
    export interface Props
    {
        data: Data;
    }
}
