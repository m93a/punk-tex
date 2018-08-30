declare module 'markdown-it-replacements'
{
    function MarkdownItReplacements(...args: any[]): any;

    namespace MarkdownItReplacements
    {
        const replacements: {
            name: string,
            re: RegExp,
            sub(s: string): string,
            default: boolean,
        }[];
    }

    export default MarkdownItReplacements;
}