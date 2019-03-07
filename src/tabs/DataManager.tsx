import * as React from 'react';
import Tab from './Tab';
import { Data, Table } from '../structures/Data';
import { Quantity } from './Quantities';
import { state } from '../state';

import * as parseDecimal from 'parse-decimal-number';
import { Paper, Grid, List, ListItem, ListItemText } from '@material-ui/core';
import { LambdaCache } from 'src/lib/react-helpers';


export interface DataTable
{
    id: string;
    name: string;
    columns: DataColumn[];
}

export interface DataColumn
{
    quantity: Quantity;
    values: (number|string)[];
}



class DataManager extends Tab
{
    public static get title() { return 'Data' };

    private cacheOrRetrieve = LambdaCache();
    private data: Data | undefined; // !FIXME remove

    public render()
    {
        return <Grid container
            direction="row"
            spacing={8}
            alignItems="stretch"
            style={{height:"100%"}}
        >
            <Grid item xs={2}>
                <Paper square style={{height:"100%"}}>
                    <List>
                        {this.renderMenu()}
                    </List>
                </Paper>
            </Grid>
            <Grid item>
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

            return <span>{table.name}</span>
        }
        else return (
            <div onPaste={this.onPaste}>
                {this.data ? <Table data={this.data} /> : "Vložte tabulku z Excelu pomocí Ctrl+V"}
            </div>
        );
    }

    public onPaste = (e: React.ClipboardEvent) =>
    {
        this.data = dataFromHtml(e.clipboardData.getData('text/html'));
        this.forceUpdate();
    }
}

export default DataManager;



function dataFromHtml(src: string): Data
{
    const arr: number[][] = [];

    const doc = (new DOMParser()).parseFromString(src, 'text/html');
    const table: HTMLElement = doc.getElementsByTagName('table')[0];

    let i = 0;
    for (const tr of table.getElementsByTagName('tr'))
    {
        let j = 0;

        for (const td of tr.getElementsByTagName('td'))
        {
            arr[j] = arr[j] || [];
            arr[j][i] = parseDecimal(td.innerText,' ,');
            j++;
        }

        i++;
    }

    return new Data(arr);
}