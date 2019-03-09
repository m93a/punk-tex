import LangStrings from './lang/_types';
import { loadLang } from './lang';

import { EventTarget, addEventListener, removeEventListener, dispatchEvent } from './lib/react-helpers/Event';
import { IndexOutOfRangeError } from './lib/react-helpers';

import Project from './project';

export interface Point
{
    row: number;
    column: number;
}

export interface AppState
extends EventTarget<AppState.Event>
{
    language: string;
    strings: LangStrings;

    workspace: number;

    project: Project;

    editingReference?: string;
    editingEquation?:  string;
    editingQuantity?:  string;
    editingTable?:     string;

    cursor: Point;
    cursorOnScreen: Point;

    token?: Token;

    pointToIndex(point: Point): number;
    indexToPoint(index: number): Point;
}

export namespace AppState
{
    export enum Event
    {
        ContentChange = 'contentchange',
        TabChange = 'tabchange',
        ReferencesChange = 'referenceschange',
        LanguageChange = 'languagechange',
        CompilationError = 'compilationerror',
        LoginStateChange = 'loginstatechange',
        ProjectChange = 'projectchange',
    }
}

export function setProject(proj: Project) {
    state.project = proj;
    state.dispatchEvent(AppState.Event.ProjectChange);
}

export const state: AppState =
{
    addEventListener,
    removeEventListener,
    dispatchEvent,

    language: 'cs',
    strings: loadLang('cs'),

    workspace: 0,

    project: new Project(true),

    cursor: {row: 0, column: 0},
    cursorOnScreen: {row: 0, column: 0},

    pointToIndex(point: Point)
    {
        const str = this.project.content;
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
        const str = this.project.content;
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