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


import { EquationStringName } from '../tabs/Equations';
export type EquationStrings =
{
    [key in EquationStringName]: string
}

import { QuantityStringName } from '../tabs/Quantities';
export type QuantityStrings =
{
    [key in QuantityStringName]: string
}


export interface Strings
{
    reference: ReferenceStrings;
    equation: EquationStrings;
    quantity: QuantityStrings;
}

export default Strings;