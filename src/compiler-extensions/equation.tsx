import * as React from 'react';
import * as math from 'mathjs';
import { toMathMLString } from "texzilla";

import { MarkdownIt } from 'markdown-it';
import { AppState } from '../state';
import { renderAsInlineToken } from '../lib/markdown-it-react-interop';

import makeRule from './lib.inline-command';

export default function insertPlugin(md: MarkdownIt, appState: AppState)
{
    let usedEqns: string[] = [];

    function onParse()
    {
        usedEqns = [];
    }

    function renderRef(id: string)
    {
        const index = usedEqns.indexOf(id);

        if (!appState.equations.has(id))
        {
            return <span className="ref-eqref ref-index ref-intext error">(Neznámé id citované rovnice: {id})</span>
        }

        if (index === -1)
        {
            return <span className="ref-eqref ref-index ref-intext error">(Citovaná rovnice nebyla v textu nalezena: {id})</span>
        }

        return <span className="ref-eqref ref-index ref-intext">({index + 1})</span>
    }

    function renderInlineEquation(id: string)
    {
        if (!appState.equations.has(id))
        return <span className='eqn-body error'>(Neznámé id rovnice: {id})</span>;

        const eq = appState.equations.get(id)!;

        const tex = eq.tex ||
                `${math.parse(eq.lhs).toTex()} = ${math.parse(eq.rhs).toTex()}`;


        console.log(toMathMLString(tex));

        return (
            <span className='eqn-body' dangerouslySetInnerHTML={{
                __html: toMathMLString(tex)
            }} />
        );
    }

    function renderBlockEquation(id: string)
    {
        let unique = true;
        let index = usedEqns.indexOf(id);

        if (index === -1)
        {
            index = usedEqns.length;
            usedEqns.push(id);
        }
        else
        {
            unique = false;
        }

        return <p className='eqn-block'>
            {unique || <span className="error">(Rovnice {id} už byla použita.)</span>}
            {renderInlineEquation(id)}
            <span className='eqn-index'>({index + 1})</span>
        </p>
    }

    const rule_eqref = makeRule(
        '&', 'eqref', '(', ')',

        (state, content) =>
        {
            const el = renderRef(content);
            renderAsInlineToken(state, el);
        }
    );

    const rule_inline = makeRule(
        '&', 'eq', '(', ')',

        (state, content) =>
        {
            const el = renderInlineEquation(content);
            renderAsInlineToken(state, el);
        }
    );

    const rule_block = makeRule(
        '&', 'Eq', '(', ')',

        (state, content) =>
        {
            const el = renderBlockEquation(content);
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


    md.inline.ruler.after('image', 'amp-eqref',     rule_eqref);
    md.inline.ruler.after('image', 'amp-eq-inline', rule_inline);
    md.inline.ruler.after('image', 'amp-eq-block',  rule_block);
};