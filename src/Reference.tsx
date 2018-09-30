import * as React from 'react';
import * as moment from 'moment';

class Reference extends React.Component<Reference.Props>
{
    public render()
    {
        // Format

        const format = this.props.format || Reference.Format.CSN_ISO_690;

        if (format !== Reference.Format.CSN_ISO_690)
        {
            throw new Error('The chosen format is yet to be implemented.');
        }

        

        // Authors

        let etAl = this.props.authors.etAl;

        const authorsArr: string[] =
        this.props.authors.names.map(
            (a, i, l) =>
            {
                const len = l.length;
                let ending = '';

                if (i === len - 2 && !etAl)
                {
                    ending = ' a';
                }
                else if (i !== len - 1)
                {
                    ending = ',';
                }


                if (!a.surname)
                {
                    throw new TypeError('Each author must have at least an surname.');
                }
                else if (!a.name)
                {
                    return a.surname.toUpperCase() + ending;
                }
                else if (i === 0)
                {
                    return a.surname.toUpperCase() + ', ' + a.name + ending;
                }
                else
                {
                    return a.name + ' ' + a.surname.toUpperCase() + ending;
                }
            }
        );

        if (etAl)
        {
            etAl = typeof etAl === 'string' ? etAl : 'et al.';
            authorsArr.push(etAl);
        }

        let authors = authorsArr.join(' ').trim();

        if (authors[authors.length - 1] !== '.') authors += '.';

        authors += ' ';



        // Title

        let title: React.ReactNode;
        let mainTitle = this.props.title;
        let partTitle = this.props.partTitle;

        if (this.props.subtitle)
        {
            mainTitle += ': ' + this.props.subtitle;
        }
        if (this.props.partSubtitle)
        {
            partTitle += ': ' + this.props.partSubtitle;
        }

        if (partTitle)
        {
            if (this.props.online)
            {
                title = <span>
                    <b>{partTitle}. </b>
                    <i>{mainTitle}</i> [online]. {' '}
                </span>
            }
            else
            {
                title = <span>
                    <b>{partTitle}. </b>
                    <i>{mainTitle}. </i>
                </span>
            }
        }
        else
        {
            if (this.props.online)
            {
                title = <span>
                    <b><i>{mainTitle}</i></b> [online]. {' '}
                </span>
            }
            else
            {
                title = <span>
                    <b><i>{mainTitle}. </i></b>
                </span>
            }
        }

        

        // Edition

        let edition = '';

        if (this.props.edition)
        {
            edition = this.props.edition.trim();
            if (edition[edition.length - 1] !== '.') edition += '.';
            edition += ' ';
        }



        // Published

        let published = '';

        if (this.props.placePublished)
        {
            if (this.props.datePublished)
            {
                published = this.props.placePublished + ', ' + this.props.datePublished;
            }
            else
            {
                published = this.props.placePublished;
            }
        }
        else if (this.props.datePublished)
        {
            published = this.props.datePublished;
        }

        if (this.props.referenced)
        {
            const cit = moment(this.props.referenced).format('YYYY-MM-DD');
            published += ' [cit. ' + cit + ']';
        }

        if (published) published += '. ';



        // Identifier

        let identifier = '';

        if (this.props.identifier)
        {
            identifier = this.props.identifier + '. ';
        }



        // URL

        const url: React.ReactNode[] = [];

        if (this.props.url)
        {
            if (this.props.online)
            {
                url.push('Dostupné z: ');
            }
            else
            {
                url.push('Dostupné také z: ');
            }

            url.push(<a href={this.props.url.href}>{this.props.url.href}</a>);
            url.push('. ');
        }



        return <span>
            {authors}
            {title}
            {edition}
            {published}
            {identifier}
            {url}
        </span>;
    }
}

namespace Reference
{
    export enum Format
    {
        CSN_ISO_690
    }

    export interface Author
    {
        name: string;
        surname: string;
    }

    export interface Authors
    {
        names: Author[],
        etAl: boolean | string
    }

    export interface Params
    {
        id: string;
        title: string;
        subtitle?: string;
        partTitle?: string;
        partSubtitle?: string;
        authors: Authors;

        datePublished?: string;
        placePublished?: string;
        edition?: string;

        identifier?: string;
        url?: URL;
        online?: boolean;
        referenced?: Date;
    }

    export interface Props extends Params
    {
        format?: Format;
    }
}

export default Reference;