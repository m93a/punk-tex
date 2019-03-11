import * as React from 'react';
import { LambdaCache, hashObject } from 'src/lib/react-helpers';

import { Table, TableBody, TableHead, TableRow, TableCell } from '@material-ui/core';
import { FaCog } from "react-icons/fa";

import DataManager, { Data, DataColumn, resolveData } from ".";
import { ColumnSettings } from './ColumnSettings';

export namespace TableMaker
{
    export interface Props
    {
        manager: DataManager;
        data: Data;
    }
}
export class TableMaker
extends React.Component<TableMaker.Props>
{
    private cacheOrRetrieve = LambdaCache();

    public render()
    {
        return <Table>
            { this.renderHead() }
            { this.renderBody() }
            { this.renderDialog() }
        </Table>
    }

    private renderHead()
    {
        return <TableHead>
            { this.props.data.columns.map( col => this.renderHeading(col)) }
        </TableHead>
    }

    private renderHeading(col: DataColumn)
    {
        return <TableCell component="th" key={hashObject(col)}>
            {col.quantity ? col.quantity.name : "[veličina]"}{" "}
            <FaCog className="icon button" onClick={this.cacheOrRetrieve(col, this.props.manager.modals, () => { this.props.manager.modals.openColumnSettings = col; this.props.manager.forceUpdate() })} /> {/* Yes I can make a line this long. */}
        </TableCell>;
    }

    private renderBody()
    {
        const columns = this.props.data.columns;

        return <TableBody>
            { resolveData(this.props.data).map( (row, r) =>
                <TableRow key={hashObject(row)}>
                    { row.map( (value, c) =>
                        <TableCell key={hashObject(columns[c])}>
                            {
                                value === undefined
                                ? ""
                                : columns[c].values[r] === undefined
                                ? <i>{value}</i>
                                : value
                            }
                        </TableCell>
                    ) }
                </TableRow>
            ) }
        </TableBody>;
    }

    private renderDialog()
    {
        const manager = this.props.manager;
        const modals = manager.modals;

        if (!modals.openColumnSettings) return;

        return (
            <ColumnSettings
                col={modals.openColumnSettings}
                onClose={this.cacheOrRetrieve(
                    modals, () => {
                        modals.openColumnSettings = undefined;
                        manager.forceUpdate();
                    }
                )}
            />
        );
    };


}