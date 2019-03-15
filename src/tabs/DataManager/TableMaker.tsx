import * as React from 'react';
import { LambdaCache, hashObject } from 'src/lib/react-helpers';

import { Table, TableBody, TableHead, TableRow, TableCell } from '@material-ui/core';
import { FaCog } from "react-icons/fa";

import DataManager, { Data, DataColumn, resolveData, computeRow } from ".";
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
            { this.renderSettings() }
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
            <FaCog
                className="icon button"
                onClick={this.cacheOrRetrieve('openSettings', col, () => this.openSettings(col))}
            />
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
                            { this.renderCell(c, r, value) }
                        </TableCell>
                    ) }
                </TableRow>
            ) }
        </TableBody>;
    }

    private renderCell(c: number, r: number, value?: number|string)
    {
        const columns = this.props.data.columns;

        const callback = this.cacheOrRetrieve('cellChange', c, r,
            (e: React.ChangeEvent<HTMLInputElement>) => this.onCellChange(c, r, e.target.value)
        );

        if (value === undefined)
        {
            return <input
                onChange={callback}
                style={{width:"30px"}}
            />
        }
        else if (columns[c].values[r])
        {
            return <input
                defaultValue={value + ''}
                onChange={callback}
                style={{width:"30px"}}
            />
        }
        else
        {
            return <input
                placeholder={value + ''}
                onChange={callback}
                style={{width:"30px"}}
            />
        }
    }

    private onCellChange(c: number, r: number, value?: number|string)
    {
        if (value === "") value = undefined;
        const data = this.props.data;
        data.columns[c].values[r] = value;
        computeRow(data, r, c);
        this.forceUpdate();
    }

    private openSettings(col: DataColumn)
    {
        const mgr = this.props.manager
        mgr.modals.openColumnSettings = col;
        mgr.forceUpdate();
    }

    private renderSettings()
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