import * as React from 'react';
import { LambdaCache, hashObject } from 'src/lib/react-helpers';

import { Table, TableBody, TableHead, TableRow, TableCell } from '@material-ui/core';
import { FaCog } from "react-icons/fa";

import DataManager, { Data, DataColumn } from ".";
import { ColumnSettings } from './ColumnSettings';

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