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


import { EquationStringName } from '../tab/Equations';
export type EquationStrings =
{
    [key in EquationStringName]: string
}


export interface Strings
{
    reference: ReferenceStrings;
    equation: EquationStrings;
}

export default Strings;