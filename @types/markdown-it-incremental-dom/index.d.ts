declare module 'markdown-it-incremental-dom'
{
    import { MarkdownIt } from 'markdown-it';
    import * as IncrementalDOM from 'incremental-dom';

    function insertPlugin(md: MarkdownIt, id: typeof IncrementalDOM): void;
    export default insertPlugin;
}