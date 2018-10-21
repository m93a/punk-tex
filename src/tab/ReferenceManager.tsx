import * as React from 'react';
import {FaRegBookmark, FaRegEdit} from 'react-icons/fa';
import Iter from '../lib/react-helpers/Iterable'

import Tab from '.';
import { state, State } from '../state';
import Event from '../lib/react-helpers/Event';

import Ref from '../Reference';
import { Ω } from '../lang';

import { LambdaCache, hashObject } from "../lib/react-helpers";


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
                            <FaRegBookmark className="icon" size='1.2em' onClick={this.pasteCitationClicked(r.id)} />
                            {" "}
                            <FaRegEdit className="icon" size='1.2em' onClick={this.editClicked(r.id)} />
                            <span>{'[' + r.id + '] '}</span>
                            <Ref {...r} />
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

        for (const key of Object.keys(Ref.Params) as (keyof Ref.Params)[])
        {
            const t = typeof Ref.Params[key];
            let input: React.ReactNode;

            switch (t)
            {
                case 'string':
                    input = <input
                        defaultValue={ref[key] as string}
                        onChange={this.referenceEdited(id, key)}
                    />
                    break;


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

        return <table key={hashObject(ref)} className="ref-edit">{arr}</table>;
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

    private referenceEdited(id: string, key: keyof Ref.Params)
    {
        const fn = (e: React.ChangeEvent) =>
        {
            const references = state.references;
            const el = e.nativeEvent.target as HTMLInputElement;
            const ref = references.get(id);
            if (ref === undefined) return;

            if (key === 'id')
            {
                const id2 = el.value;
                references.set(id2, ref);
                references.delete(id);
                ref.id = id2;
                state.editingReference = id2;
            }
            else
            {
                ref[key] = el.value;
            }

            this.forceUpdate();
        };

        return this.cacheOrRetrieve('edited', id, key, fn);
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