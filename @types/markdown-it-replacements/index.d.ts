declare module 'markdown-it-replacements'
{
    import { MarkdownIt } from 'markdown-it';
    export default MarkdownItReplacements;

    function MarkdownItReplacements(
        md: MarkdownIt,
        rules?: { [name: string]: boolean }
    ): void;

    namespace MarkdownItReplacements
    {
        const replacements: Rule[];
    }

    export interface Rule
    {
        name: string;
        re: RegExp;
        sub(s: string): string;
        default: boolean;
    }
}