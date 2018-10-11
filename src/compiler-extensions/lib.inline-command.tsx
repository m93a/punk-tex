import { RuleInline, StateInline } from 'markdown-it';

export default function inlineCommandRuleFactory(
    delim: string,
    name: string,
    lParen: string,
    rParen: string,
    fn: (state: StateInline, content: string) => void
): RuleInline
{
    return (state, silent) =>
    {
        const fullCommand = delim + name + lParen;

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

        while (src[pos] !== rParen)
        {
            pos++;
            if (pos > max) return false;
        }
        
        const content = state.src.slice(start, pos);
        

        if (!silent)
        {
            fn(state, content);
        }

        state.pos = ++pos;
        return true;
        
    };
}