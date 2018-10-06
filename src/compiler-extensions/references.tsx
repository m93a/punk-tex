import { MarkdownIt, RuleInline } from 'markdown-it';

export default function insertPlugin(md: MarkdownIt)
{
    const tokenize: RuleInline = (state, silent) =>
    {
        const command = 'cit';
        const fullCommand = '&' + command + '(';

        const src = state.src;
        const max = state.posMax;
        let pos = state.pos;

        if
        (
            src.slice(pos, pos += fullCommand.length + 1) !== fullCommand
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
            token.attrSet('class', 'bass');

            token = state.push('text', '', 0);
            token.content = 'Citace: ' + content;
            
            token = state.push('mark_end', 'mark', -1);
        }

        state.pos = ++pos;
        return true;
        
    };
  
    md.inline.ruler.before('emphasis', 'references', tokenize);
};