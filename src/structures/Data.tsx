import * as React from 'react';

export class Data
{
    public cells: number[][];

    constructor(cells: number[][])
    {
        this.cells = cells;
    }


    public transpose()
    {
        this.cells = this.transposedCells();
    }

    public transposedCells()
    {
        const cells = this.cells;
        const cellsT: number[][] = [];

        for (let row = 0; row < cells.length; row++)
        {
            for (let col = 0; col < cells[row].length; col++)
            {
                cellsT[col] = cellsT[col] || [];
                cellsT[col][row] = cells[row][col];
            }
        }

        return cellsT;
    }

    public colums(): number[][]
    {
        return Array.from(this.cells);
    }

    public rows(): number[][]
    {
        return this.transposedCells();
    }
}

export default Data;



export class Table extends React.Component<Table.Props>
{
    public render()
    {
        const rows = this.props.data.rows();

        return <table>
            <tbody>
                {rows.map((row, i) =>
                    <tr key={i}>
                        {row.map((num, j) =>
                            <td key={j}>
                                {num.toFixed(3)}
                            </td>
                        )}
                    </tr>
                )}
            </tbody>
        </table>
    }
}

export namespace Table
{
    export interface Props
    {
        data: Data;
    }
}
