import * as React from 'react';

import { MarkdownIt, RuleInline } from 'markdown-it';
import { State } from '../state';
import { renderAsInlineToken } from '../lib/markdown-it-react-interop';

export default function insertPlugin(md: MarkdownIt, appState: State)
{
    let n = 0;

    const cite: RuleInline = (state, silent) =>
    {
        const delim = '&';
        const command = 'cite';
        const fullCommand = delim + command + '(';

        const src = state.src;
        const max = state.posMax;
        let pos = state.pos;

        if (src[pos] !== delim) return false;

        if
        (
            src.slice(pos, pos += fullCommand.length) !== fullCommand
        )
        {
            return false;
        }

        const start = pos;

        while (src[pos] !== ')')
        {
            pos++;
            if (pos > max) return false;
        }
        
        const content = state.src.slice(start, pos);
        

        if (!silent)
        {
            const el = <mark>[{n++}] Citace: {content}</mark>;
            renderAsInlineToken(state, el);
        }

        state.pos = ++pos;
        return true;
        
    };


    const parse_old = md.parse;
    md.parse = function(...args: [string, any])
    {
        n = 0;
        return parse_old.call(this, ...args);
    }


    md.inline.ruler.after('newline', 'amp-cite', cite);
};