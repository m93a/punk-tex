declare module 'markdown-it-math'
{
    import { MarkdownIt } from 'markdown-it';

    const insertPlugin: (md: MarkdownIt, options: Options) => any;
    export default insertPlugin;

    export interface Options
    {
        inlineOpen?: string;
        inlineClose?: string;
        blockOpen?: string;
        blockClose?: string;
        renderingOptions?: RenderingOptions;
        inlineRenderer?(str: string): string;
        blockRenderer?(str: string): string;
    }

    // TODO: import this from @types/ascii2mathml when my PR lands
    interface RenderingOptions {
        decimalMark?: string;
        colSep?: string;
        rowSep?: string;
        display?: 'inline' | 'block';
        dir?: 'ltr' | 'rtl';
        bare?: boolean;
        standalone?: boolean;
        annotate?: boolean;
    }
}