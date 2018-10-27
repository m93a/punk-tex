import * as React from 'react';

import { MarkdownIt } from 'markdown-it';
import { State } from '../state';
import { renderAsInlineToken } from '../lib/markdown-it-react-interop';

import Reference from '../structures/Reference';
import makeRule from './lib.inline-command';

export default function insertPlugin(md: MarkdownIt, appState: State)
{
    let usedRefs: string[] = [];

    function onParse()
    {
        usedRefs = [];
    }

    function renderRef(id: string)
    {
        if (!appState.references.has(id))
        {
            return <span className="ref-index ref-intext error">[Neznámé id citace: {id}]</span>
        }

        let index = usedRefs.indexOf(id);
        if (index === -1)
        {
            index = usedRefs.length;
            usedRefs.push(id);
        }

        return <span className="ref-index ref-intext">[{index + 1}]</span>;
    }

    function renderUsedRefs()
    {
        const allRefs = appState.references;
        const renderedRefs: React.ReactNode[] = [];
        for (let i = 0; i < usedRefs.length; i++)
        {
            const id = usedRefs[i];
            const ref = allRefs.get(id);
            if (!ref)
            {
                renderedRefs.push(
                    <p className="ref-body error" key={id}>
                        [{i+1}] Nebylo nalezeno tělo reference s id: {id}.
                    </p>
                );
            }
            else
            {
                renderedRefs.push(
                    <p className="ref-body" key={id}>
                        <span className="ref-index">[{i+1}]</span>
                        {" "} <Reference {...ref} />
                    </p>
                );
            }
        }

        return <div className="ref-list">
            {renderedRefs}
        </div>
    }

    const rule_cite = makeRule(
        '&', 'cite', '(', ')',

        (state, content) =>
        {
            const el = renderRef(content);
            renderAsInlineToken(state, el);
        }
    );

    const rule_references = makeRule(
        '&', 'references', '(', ')',

        (state, content) =>
        {
            const el = renderUsedRefs();
            renderAsInlineToken(state, el);
        }
    );


    const parse_old = md.parse;
    md.parse = function(...args: [string, any])
    {
        onParse();
        return parse_old.call(this, ...args);
    }

    const parseInline_old = md.parseInline;
    md.parseInline = function(...args: [string, any])
    {
        onParse();
        return parseInline_old.call(this, ...args);
    }


    md.inline.ruler.after('image',    'amp-cite',       rule_cite);
    md.inline.ruler.after('amp-cite', 'amp-references', rule_references);
};