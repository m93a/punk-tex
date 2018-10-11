import * as React from 'react';

import { MarkdownIt } from 'markdown-it';
import { renderAsInlineToken } from '../lib/markdown-it-react-interop';

import makeRule from './lib.inline-command';


const tex = <span className="TeX">
    <span className="TeX-T">T</span>
    <span className="TeX-e">E</span>
    <span className="TeX-X">X</span>
</span>;

const latex = <span className="LaTeX">
    <span className="LaTeX-L">L</span>
    <span className="LaTeX-a">A</span>
    {tex}
</span>;

const punktex = <span className="punkTeX">
    <span className="punkTeX-punk">
        <span className="punkTeX-p">p</span>
        <span className="punkTeX-u">u</span>
        <span className="punkTeX-n">n</span>
        <span className="punkTeX-k">k</span>
    </span>
    {tex}
</span>;



export default function insertPlugin(md: MarkdownIt)
{
    md.inline.ruler.after(
        'image',
        'amp-punktex',
        makeRule(
            '&', 'punktex', '(', ')',
            (state, content) => renderAsInlineToken(state, punktex)
        )
    );
    md.inline.ruler.after(
        'image',
        'amp-latex',
        makeRule(
            '&', 'latex', '(', ')',
            (state, content) => renderAsInlineToken(state, latex)
        )
    );
    md.inline.ruler.after(
        'image',
        'amp-tex',
        makeRule(
            '&', 'tex', '(', ')',
            (state, content) => renderAsInlineToken(state, tex)
        )
    );
}