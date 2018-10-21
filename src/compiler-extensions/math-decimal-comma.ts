import { MarkdownIt } from 'markdown-it';

export default function insertPlugin(md: MarkdownIt)
{
    md.inline.ruler.after(
        'image',
        'decimal-comma',
        () => false
    );
}