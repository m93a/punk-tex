import * as React from 'react';
import Iter from '../lib/react-helpers/Iterable'

import Tab from '.';
import { state, State } from '../state';
import Event from '../lib/react-helpers/Event';

import Reference from '../Reference';
import { Ω } from '../lang';

import { LambdaCache, hashObject } from "../lib/react-helpers";

import
{
    FaRegBookmark,
    FaRegEdit,
    FaRegTrashAlt,
    FaPlusCircle,
    FaTimesCircle
}
from 'react-icons/fa';

const pad = (i: number, l: number) => { let s = ''+i; while(s.length < l) s = 0 + s; return s; }
const formatDate = (d: Date) => pad(d.getFullYear(), 4) + '-' + pad(d.getMonth()+1, 2) + '-' + pad(d.getDate(), 2);


class ReferenceManager extends Tab
{
    public static get title() { return 'References'; }

    /**
     * Function that caches callbacks in order to avoid producing new
     * functions with each render. This way React knows when nothing
     * has changed and doesn't rerender the whole view.
     */
    private cacheOrRetrieve = LambdaCache();

    public render()
    {
        return <div>
            <div className="ref-new">
                <FaPlusCircle className="icon button" onClick={this.newReferenceClicked()} />
                Nová reference
            </div>
            {
                Array.from( Iter.map(state.references.values(), r =>
                {
                    if (r.id === state.editingReference)
                    {
                        return this.renderEditor(r.id);
                    }
                    else
                    {
                        return <div key={hashObject(r)} className="ref-body">
                            <FaRegBookmark className="icon button" size='1.2em' onClick={this.pasteCitationClicked(r.id)} />
                            <FaRegEdit     className="icon button" size='1.2em' onClick={this.editClicked(r.id)}          />
                            <FaRegTrashAlt className="icon button" size='1.2em' onClick={this.deleteClicked(r.id)}        />
                            <span>{'[' + r.id + '] '}</span>
                            <Reference {...r} />
                        </div>;
                    }
                }) )
            }
        </div>;
    }

    private renderEditor(id: string)
    {
        const ref = state.references.get(id);
        if (!ref) return;


        const arr: React.ReactNode[] = [];

        for (const key of Object.keys(Reference.Params) as (keyof Reference.Params)[])
        {
            const p = Reference.Params[key];
            const t = typeof p;
            let input: React.ReactNode;

            switch (t)
            {
                case 'string':
                    input = <input
                        defaultValue={ref[key] as string}
                        onChange={this.referenceEdited(id, key)}
                    />
                    break;

                case 'boolean':
                    input = <input
                        type="checkbox"
                        checked={ref[key] as boolean}
                        onChange={this.referenceEdited(id, key)}
                    />
                    break;

                case 'object':
                    if (p instanceof URL)
                    {
                        input = <input
                            type="url"
                            defaultValue={ref[key] ? (ref[key] as URL).href : ''}
                            onChange={this.referenceEdited(id, key)}
                            onBlur={this.resetValueOnBlur(id, key)}
                        />
                        break;
                    }
                    if (p instanceof Date)
                    {
                        input = <input
                            type="date"
                            defaultValue={ref[key]? formatDate(ref[key] as Date) : ''}
                            onChange={this.referenceEdited(id, key)}
                        />
                        console.log(ref[key] && formatDate(ref[key] as Date));
                        break;
                    }
                    if (typeof (p as any).etAl === 'boolean' && Array.isArray((p as any).names))
                    {
                        const authors = ref.authors;
                        input = <table><tbody>
                        <tr><td>
                            <FaPlusCircle
                                className="icon button"
                                onClick={this.newAuthor(id)}
                            />
                            Přidat autora
                        </td></tr>
                        {
                            authors.names.map((n, i) =>
                                <tr key={i}><td>
                                    <input
                                        value={n.name} placeholder="Jméno"
                                        onChange={this.authorEdited(id, i, 'name')}
                                    />
                                    <input
                                        value={n.surname} placeholder="Příjmení"
                                        onChange={this.authorEdited(id, i, 'surname')}
                                    />
                                    <FaTimesCircle
                                        className="icon button"
                                        onClick={this.authorDeleted(id, i)}
                                    />
                                </td></tr>
                            )
                        }
                        </tbody></table>;
                        break;
                    }


                default:
                    input = <mark>Neznámý typ...</mark>;
                    break;
            }


            arr.push(
                <tr key={key}>
                    <td><Ω c="reference" k={key} /></td>
                    <td>{ input }</td>
                </tr>
            );
        }

        return <div key={hashObject(ref)} className="ref-edit">
            <FaTimesCircle className="icon button" onClick={this.closeEditClicked()} />
            <span className="ref-edit-title">Editace reference [{ref.id}]</span>
            <table><tbody>{arr}</tbody></table>
        </div>
    }


    // UI Click Events

    private pasteCitationClicked(id: string)
    {
        const fn = () =>
        {
            const index = state.pointToIndex(state.cursor);

            state.content =
                state.content.substring(0, index) +
                "&cite(" + id + ")" +
                state.content.substring(index);

            state.dispatchEvent(
                State.Event.ContentChange,
                { source: this }
            );
        };

        return this.cacheOrRetrieve('pasteCitation', id, fn);
    }

    private editClicked(id: string)
    {
        const fn = () =>
        {
            state.editingReference = id;
            this.forceUpdate();
        };

        return this.cacheOrRetrieve('edit', id, fn);
    }

    private closeEditClicked()
    {
        const fn = () =>
        {
            state.editingReference = undefined;
            this.forceUpdate();
        };

        return this.cacheOrRetrieve('closeEdit', fn);
    }

    private newReferenceClicked()
    {
        const fn = () =>
        {
            let id: string;
            do
            {
                id = 'reference-'+((Math.random()*1000)|0);
            }
            while(state.references.has(id));

            const ref: Reference.Params =
            {
                id,
                title: '',
                authors: {names: [], etAl: false}
            };

            state.references.set(id, ref);
            state.editingReference = id;

            this.forceUpdate();
        };

        return this.cacheOrRetrieve('newReference', fn);
    }

    private deleteClicked(id: string)
    {
        const fn = () =>
        {
            if (confirm("Opravdu chceš odstranit referenci ["+id+"]?"))
            {
                state.references.delete(id);
                this.forceUpdate();
            }
        };

        return this.cacheOrRetrieve('deleteClicked', id, fn);
    }

    private resetValueOnBlur(id: string, key: keyof Reference.Params)
    {
        const fn = (e: React.FocusEvent) =>
        {
            const el = e.nativeEvent.target as HTMLInputElement;
            el.value = el.getAttribute('value') || '';
        };

        return this.cacheOrRetrieve('resetValueOnBlur', id, key, fn);
    }

    private referenceEdited(id: string, key: keyof Reference.Params)
    {
        const fn = (e: React.ChangeEvent) =>
        {
            const references = state.references;
            const el = e.nativeEvent.target as HTMLInputElement;
            const ref = references.get(id);
            const p = Reference.Params[key];
            const t = typeof p;

            if (ref === undefined) return;

            if (key === 'id')
            {
                const id2 = el.value;
                references.set(id2, ref);
                references.delete(id);
                ref.id = id2;
                state.editingReference = id2;
            }
            else if (t === 'boolean')
            {
                ref[key] = el.checked;
            }
            else if (t === 'object' && p instanceof URL)
            {
                if (!el.validity.valid) return;
                ref[key] = el.value ? new URL(el.value) : undefined;
            }
            else if (t === 'object' && p instanceof Date)
            {
                ref[key] = el.value ? new Date(el.value) : undefined;
            }
            else
            {
                ref[key] = el.value;
            }

            this.forceUpdate();
        };

        return this.cacheOrRetrieve('edited', id, key, fn);
    }

    private authorEdited(id: string, index: number, key: 'name' | 'surname')
    {
        const fn = (e: React.ChangeEvent) =>
        {
            const el = e.nativeEvent.target as HTMLInputElement;

            const ref = state.references.get(id);
            if (!ref) return;

            ref.authors.names[index][key] = el.value;

            this.forceUpdate();
        };

        return this.cacheOrRetrieve('authorEdited', id, index, key, fn);
    }

    private newAuthor(id: string)
    {
        const fn = () =>
        {
            const ref = state.references.get(id);
            if (!ref) return;

            ref.authors.names.push({ name: '', surname: '' });
            this.forceUpdate();
        };

        return this.cacheOrRetrieve('newAuthor', id, fn);
    }

    private authorDeleted(id: string, index: number)
    {
        const fn = () =>
        {
            const ref = state.references.get(id);
            if (!ref) return;

            ref.authors.names.splice(index, 1);
            this.forceUpdate();
        }

        return this.cacheOrRetrieve('authorDeleted', id, index, fn);
    }



    // Large-scale Events

    public onExternalChange = (e: Event) =>
    {
        if (e.source !== this) this.forceUpdate();
    }

    public componentDidMount()
    {
        state.addEventListener(
            State.Event.ContentChange,
            this.onExternalChange
        );
    }

    public componentWillUnmount()
    {
        state.removeEventListener(
            State.Event.ContentChange,
            this.onExternalChange
        );
    }
}

export default ReferenceManager;