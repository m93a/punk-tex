import * as React from 'react';
import Tab from '../Tab';
import { Quantity } from '../Quantities';
import { SerializedEquation } from '../Equations';
import { state } from 'src/state';
import * as math from "mathjs";

import { LambdaCache, hashObject } from 'src/lib/react-helpers';

import
{
    Paper, Grid,
    List, ListItem, ListItemText,
}
from '@material-ui/core';

import { TableMaker } from './TableMaker';
import dataFromHtml from './dataFromHtml';


export interface Data
{
    id: string;
    name: string;
    columns: DataColumn[];
}

export interface DataColumn
{
    quantity: Quantity | null;
    values: (number|string|undefined)[];
    equation: SerializedEquation | null;
}
interface ModalsState
{
    openColumnSettings: DataColumn | undefined;
}



class DataManager extends Tab
{
    public static get title() { return 'Data' };

    private cacheOrRetrieve = LambdaCache();

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

        for (const table of state.project.tables.values())
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
        if (state.project.tables.has(state.editingTable!))
        {
            const table = state.project.tables.get(state.editingTable!)!;

            return <TableMaker manager={this} data={table} />
        }
        else return (
            <div>
                Vložte tabulku z Excelu pomocí Ctrl+V
            </div>
        );
    }

    public onPaste = (e: React.ClipboardEvent) =>
    {
        const data = dataFromHtml(e.clipboardData.getData('text/html'));
        if (!data) return;

        const id = 'pasted-' + btoa(hashObject(data) + '').substr(-7,5);
        data.id = id;
        state.project.tables.set(id, data);
        state.editingEquation = id;
        this.forceUpdate();
    }
}

export default DataManager;


type cellValue = number|string|undefined;

/**
 * @returns arr[row][col]
 */
export function resolveData(data: Data): cellValue[][]
{
    const columns = data.columns;
    const rowArr: cellValue[][] = [];

    for (let row = 0 ;; row++)
    {
        if (columns.every(column => column.values.length <= row)) break;

        const colArr: cellValue[] = [];

        for (let col = 0; col < columns.length; col++)
        {
            const column = columns[col];
            let value = column.values[row];

            if (value === undefined && column.equation)
            {
                const scope: { [name: string]: cellValue } = Object.create(null);

                for (let prevCol = 0; prevCol < col; prevCol++)
                {
                    const prevColumn = columns[prevCol];
                    if (prevColumn.quantity) scope[prevColumn.quantity.id] = colArr[prevCol];
                }

                try {
                    value = math.eval(column.equation.rhs, scope);
                }
                catch (e)
                {
                    console.error(e);
                    value = "error";
                }
            }

            colArr.push(value);
        }

        rowArr.push(colArr);
    }

    console.log(rowArr);
    return rowArr;
}