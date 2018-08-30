import 'markdown-it';

declare module 'markdown-it'
{
    interface MarkdownIt
    {
        renderToIncrementalDOM(md: string, env?: any): (data: {}) => void;
    }
}