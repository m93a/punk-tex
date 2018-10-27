import Reference from '../structures/Reference';

export type ReferenceStrings =
{
    [key in keyof Required<Reference.Params>]: string;
}
&
{
    addAuthor: string,
    name: string,
    surname: string,
    etAl: string
}

export interface Strings
{
    reference: ReferenceStrings;
}

export default Strings;