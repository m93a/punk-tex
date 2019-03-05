import * as React from 'react';
import Tab from './Tab';
import { Data, Table } from '../structures/Data';

import * as parseDecimal from 'parse-decimal-number';

class DataManager extends Tab
{
    public static get title() { return 'Data' };


    private data: Data | undefined;

    public render()
    {
        return <div onPaste={this.onPaste}>
            {this.data ? <Table data={this.data} /> : "Vložte tabulku z Excelu pomocí Ctrl+V"}
        </div>;
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