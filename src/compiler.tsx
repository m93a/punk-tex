// Compiler
import * as MarkdownIt from 'markdown-it';
import * as IncrementalDOM from './lib/incremental-dom';
import mdIncrementalDOM from 'markdown-it-incremental-dom';
import * as TexZilla from 'texzilla';
import mdMath from 'markdown-it-math';
import mdReplace from 'markdown-it-replacements';

import state from './state';
import references from './compiler-extensions/references';
import punktex from './compiler-extensions/punktex';

const md = MarkdownIt({
  breaks: false,
  html: true,
  quotes: "„“‚‘",
  typographer: true,
  xhtmlOut: true,
});

md.use(
  mdIncrementalDOM,
  IncrementalDOM
);

md.use(
  mdMath,
  {
    inlineRenderer(str: string) {
        return TexZilla.toMathMLString(str);
    },
    blockRenderer(str: string) {
        return TexZilla.toMathMLString(str, true);
    }
  }
);

[
  ['copyright', '©'],
  ['registered', '®'],
  ['tm', '™'],
  ['S', '§'],
  ['dag', '†']
]
.forEach( entry =>
  mdReplace.replacements.push({
    default: true,
    name: entry[0],
    re: RegExp('\\\\' + entry[0], 'g'),
    sub(s: string) { return entry[1]; },
  })
);

md.use(mdReplace);

md.use(references, state);
md.use(punktex);


export function renderToElement(id: string, code: string)
{
    const target = document.getElementById(id);
    const content = md.renderToIncrementalDOM(code);

    if (!target) throw Error("Couldn't find element with id: " + id);

    IncrementalDOM.patch(target, content);
}