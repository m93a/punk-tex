import { EventTarget, addEventListener, removeEventListener, dispatchEvent } from './lib/react-helpers/Event';
import { IndexOutOfRangeError } from './lib/react-helpers';
import sampleText from './sampleText';
import Tab from './tab';
import Reference from './Reference';
import sampleReferences from './sampleReferences';
import LangStrings from './lang/_types';
import { loadLang } from './lang';

export interface Point
{
    row: number;
    column: number;
}

export interface State
extends EventTarget<State.Event>
{
    language: string;
    strings: LangStrings;

    tabs: (typeof Tab)[];
    content: string;
    references: Map<string, Reference.Params>;
    editingReference?: string;

    cursor: Point;
    cursorOnScreen: Point;

    pointToIndex(point: Point): number;
    indexToPoint(index: number): Point;
}

export namespace State
{
    export enum Event
    {
        ContentChange = 'contentchange',
        TabChange = 'tabchange',
        ReferencesChange = 'referenceschange',
        LanguageChange = 'languagechange',
        CompilationError = 'compilationerror'
    }
}

export const state: State =
{
    addEventListener,
    removeEventListener,
    dispatchEvent,

    language: 'cs',
    strings: loadLang('cs'),

    tabs: [],
    content: sampleText,
    references: sampleReferences,

    cursor: {row: 0, column: 0},
    cursorOnScreen: {row: 0, column: 0},

    pointToIndex(point: Point)
    {
        const str = this.content;
        let row = 0;
        let pos = 0;
        let lineStart = 0;

        while (true)
        {
            if (row <= point.row)
            {
                pos = lineStart;
            }
            else break;

            lineStart = str.indexOf('\n', pos) + 1;
            row++;

            if (lineStart === 0) break; // last line
        }

        const index = pos + point.column;

        if (index > str.length)
            throw new IndexOutOfRangeError('The index is larger that the length of the string.');

        return index;
    },

    indexToPoint(index: number)
    {
        const str = this.content;
        let row = 0;
        let pos = 0;
        let lineStart = 0;

        if (index > str.length)
            throw new IndexOutOfRangeError('The index is larger that the length of the string.');

        while (true)
        {
            lineStart = str.indexOf('\n', pos) + 1;

            if (lineStart === 0) break; // last line

            if (lineStart <= index)
            {
                pos = lineStart;
                row++;
            }
            else break;
        }

        return { row, column: index - pos };
    }
};

export default state;