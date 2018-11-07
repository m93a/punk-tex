import * as React from 'react';

import { Strings } from './_types';
import { AppState, state } from '../state';

import cs from './cs';
import en from './en';

const langs =
{
    cs, en
}

export function loadLang(code: string): Strings
{
    if (!Object.keys(langs).includes(code))
    {
        throw new TypeError('The provided language code does not correspond to any known language: ' + code);
    }

    return langs[code];
}

export function changeLanguage(code: string): void
{
    state.strings = loadLang(code);
    state.language = code;
    state.dispatchEvent(AppState.Event.LanguageChange);
}

export function ω(
    category: keyof Strings,
    key: string // TODO keyof Strings[keyof Strings]
): string
{
    return state.strings[category][key];
}

export class Ω extends React.Component<{
    c: keyof Strings,
    k: string // TODO keyof Strings[keyof Strings]
}>
{
    public render()
    {
        return ω(this.props.c, this.props.k);
    }
}