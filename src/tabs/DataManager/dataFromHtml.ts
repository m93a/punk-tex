import { Data } from ".";
import * as parseDecimal from 'parse-decimal-number';

export default function dataFromHtml(src: string): Data | null
{
    const data: Data = {
        id: 'pasted',
        name: 'Vložená tabulka',
        columns: []
    };

    const arr = data.columns;

    const doc = (new DOMParser()).parseFromString(src, 'text/html');
    const table: HTMLElement = doc.getElementsByTagName('table')[0];

    if (!table) return null;

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

    if (i === 0) return null;

    return data;
}