import * as React from 'react';
import Tab from '../Tab';
import { Quantity } from '../Quantities';
import { state } from 'src/state';

import { LambdaCache } from 'src/lib/react-helpers';

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
        state.project.tables.set('pasted', dataFromHtml(e.clipboardData.getData('text/html')));
        state.editingEquation = 'pasted';
        this.forceUpdate();
    }
}

export default DataManager;
