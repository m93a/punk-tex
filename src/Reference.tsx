import * as React from 'react';
import { State } from './state';

class Reference extends React.Component<Reference.Props>
{
    public render()
    {
        return <span />;
    }
}

namespace Reference
{
    export interface Author
    {
        name: string;
        surname: string;
    }

    export interface Params
    {
        id: string;
        title: string;
        authors: Author[];

        datePublished?: Date;
        placePublished?: string;

        identifier?: string;
        url?: URL;
        urlPrimary: boolean;
        referenced?: Date;
    }

    export interface Props extends Params
    {
        state: State;
    }
}

export default Reference;