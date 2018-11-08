// Compiler
import * as MarkdownIt from 'markdown-it';
import * as IncrementalDOM from './lib/incremental-dom';
import mdIncrementalDOM from 'markdown-it-incremental-dom';
import texToMathML from './lib/LaTeX2MathML';
import mdMath from 'markdown-it-math';
import mdReplace from 'markdown-it-replacements';

import { state, AppState } from './state';
import references from './compiler-extensions/cite';
import punktex from './compiler-extensions/punktex';
import equation from './compiler-extensions/equation';

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
			return texToMathML(str);
		},
		blockRenderer(str: string) {
			return texToMathML(str, true);
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
md.use(equation, state);
md.use(punktex);


export function renderToElement(id: string, code: string)
{
	const target = document.getElementById(id);
    if (!target) throw Error("Couldn't find element with id: " + id);


	let content: (...p: any[]) => void;

	try
	{
		content = md.renderToIncrementalDOM(code);
		IncrementalDOM.patch(target, content);
	}
	catch(e)
	{
		console.error('Compilation error: ', e);
		return state.dispatchEvent(AppState.Event.CompilationError);
	}
}