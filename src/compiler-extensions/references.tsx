import { MarkdownIt, RuleInline } from 'markdown-it';
import { State } from '../state';

export default function insertPlugin(md: MarkdownIt, appState: State)
{
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
            let token = state.push('mark_begin', 'mark', 1);
            token.markup = fullCommand;

            token = state.push('text', '', 0);
            token.content = 'Citace: ' + content;

            token = state.push('mark_end', 'mark', -1);
            token.markup = ')';
        }

        state.pos = ++pos;
        return true;
        
    };
  
    md.inline.ruler.after('newline', 'amp-cite', cite);
};