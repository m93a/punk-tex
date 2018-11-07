
/* * *
 * Imports
 * * */

// #region

// Frameworks
import * as React from 'react';
import ui, { editable, rendererArray, staticRender } from '../lib/ui-decorators';


import Tab from './Tab';
import { AppState, state } from '../state';
// import Event from '../lib/react-helpers/Event';

import Reference from '../structures/Reference';
import { Ω } from '../lang';

// Utilities
import { Required_ish, Event, Iterable, LambdaCache, hashObject } from "../lib/react-helpers";
import FormatQuote from '@material-ui/icons/FormatQuote';

// Resources
import
{
    FaRegBookmark,
    FaRegEdit,
    FaRegTrashAlt,
    FaPlusCircle,
    FaTimesCircle
}
from 'react-icons/fa';

// #endregion




/* * *
 * Helper functions
 * * */

// #region

const pad = (i: number, l: number) => { let s = ''+i; while(s.length < l) s = 0 + s; return s; }
const formatDate = (d: Date) => pad(d.getFullYear(), 4) + '-' + pad(d.getMonth()+1, 2) + '-' + pad(d.getDate(), 2);

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type FocusEvent = React.FocusEvent<HTMLInputElement>;
type ø<T> = T | undefined;

// #endregion




/* * *
 * Controls: Editor
 * * */

// #region

type renderType = React.ReactElement<{'data-key': keyof Reference.Params}>;

class ID {}
class Authors implements Partial<Reference.Authors> {}

function genRenderable<X>(self: ReferenceManager)
{
    const renderers = genRenderers(self);

    @ui(renderers)
    class RenderableParamsClass implements Required_ish<Reference.Params>
    {
        // tslint:disable:member-access

        static render = 0 as any as staticRender<Reference.Params, renderType>;

        @editable('string', ID) id = '';

        @editable('string') title = '';
        @editable('string') subtitle = '';
        @editable('string') partTitle = '';
        @editable('string') partSubtitle = '';

        @editable(Authors)  authors = { names: [], etAl: false };

        @editable('string') datePublished = '';
        @editable('string') placePublished = '';
        @editable('string') edition = '';
        @editable('string') identifier = '';

        @editable(Date, 'undefined') referenced = undefined;
        @editable(URL, 'undefined') url = undefined;
        @editable('boolean') online = false;

        // tslint:enable:member-access
    }

    return RenderableParamsClass;
}

function genRenderers(tab: ReferenceManager): rendererArray<renderType>
{
    const cacheOrRetrieve = LambdaCache();

    return(
    [
        [
            ['string'],
            (get, set, key, ref) =>
            <input
                data-key={key}
                value={ get() }

                onChange={
                    cacheOrRetrieve('change', ref, key, (e: ChangeEvent) =>
                    {
                        set(e.target.value);
                        tab.forceUpdate();
                    })
                }
            />
        ],


        [
            ['boolean'],
            (get, set, key, ref) =>
            <input
                data-key={key}
                type="checkbox"
                checked={ get() }

                onChange={
                    cacheOrRetrieve('change', ref, key, (e: ChangeEvent) =>
                    {
                        set(e.target.checked);
                        tab.forceUpdate();
                    })
                }
            />
        ],


        [
            ['string', ID],
            (get, set, key, ref) =>
            <input
                data-key={key}
                defaultValue={ get() }

                onChange={
                    cacheOrRetrieve('change', ref, key, (e: ChangeEvent) =>
                    {
                        const id1 = get();
                        const id2 = e.target.value;
                        const refs = state.references;

                        if (id2 !== id1 && refs.has(id2))
                        {
                            e.target.setCustomValidity('Cannot change id – this identifier is already in use.');
                            return;
                        }
                        else
                        {
                            e.target.setCustomValidity('');
                        }

                        set(id2);
                        refs.set(id2, ref);
                        refs.delete(id1);
                        state.editingReference = id2;
                        tab.forceUpdate();
                    })
                }
                onBlur={
                    cacheOrRetrieve('blur', ref, key, (e: FocusEvent) =>
                    {
                        e.target.value = get();
                        e.target.setCustomValidity('');
                    })
                }
            />
        ],


        [
            [Date, 'undefined'],
            (
                get: () => ø<Date>,
                set: (v: ø<Date>) => void,
                key, ref
            ) =>
            <input
                data-key={key}
                type="date"

                defaultValue={ (x => x ? formatDate(x) : undefined)(get()) }

                onChange={
                    cacheOrRetrieve('change', ref, key, (e: ChangeEvent) =>
                    {
                        if (e.target.value)
                        {
                            set(undefined);
                        }

                        const d = new Date(e.target.value);

                        if (!isNaN(+d))
                        {
                            set(d);
                            tab.forceUpdate();
                        }
                    })
                }
                onBlur={
                    cacheOrRetrieve('blur', ref, key, (e: FocusEvent) =>
                    {
                        e.target.value = (x => x ? formatDate(x) : '')(get());
                    })
                }
            />
        ],


        [
            [URL, 'undefined'],
            (
                get: () => ø<URL>,
                set: (v: ø<URL>) => void,
                key, ref
            ) =>
            <input
                data-key={key}
                type="url"
                defaultValue={ (x => x ? x.href : undefined)(get()) }

                onChange={
                    cacheOrRetrieve('change', ref, key, (e: ChangeEvent) =>
                    {
                        if (e.target.validity.valid)
                        try
                        {
                            set(new URL(e.target.value));
                            tab.forceUpdate();
                        }
                        catch(x){}
                    })
                }
                onBlur={
                    cacheOrRetrieve('blur', ref, key, (e: FocusEvent) =>
                    {
                        e.target.value = (x => x ? x.href : '')(get());
                    })
                }
            />
        ],


        [
            [Authors],
            (a, b, key, ref: Reference.Params) =>
            <table data-key={key}><tbody>
                <tr><td>
                    <FaPlusCircle
                        className="icon button"
                        onClick={newAuthor(tab, ref)}
                    />
                    Přidat autora
                </td></tr>
                {
                    ref.authors.names.map((n, i) =>
                        <tr key={i}><td>
                            <input
                                value={n.name} placeholder="Jméno"
                                onChange={authorEdited(tab, ref, i, 'name')}
                            />
                            <input
                                value={n.surname} placeholder="Příjmení"
                                onChange={authorEdited(tab, ref, i, 'surname')}
                            />
                            <FaTimesCircle
                                className="icon button"
                                onClick={authorDeleted(tab, ref, i)}
                            />
                        </td></tr>
                    )
                }
            </tbody></table>
        ]
    ]);
}


function authorEdited(
    self: ReferenceManager,
    ref: Reference.Params,
    index: number,
    key: 'name' | 'surname'
)
{
    const fn = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        ref.authors.names[index][key] = e.target.value;
        self.forceUpdate();
    };

    return self.cacheOrRetrieve('authorEdited', ref, index, key, fn);
}

function newAuthor(
    self: ReferenceManager,
    ref: Reference.Params
)
{
    const fn = () =>
    {
        ref.authors.names.push({ name: '', surname: '' });
        self.forceUpdate();
    };

    return self.cacheOrRetrieve('newAuthor', ref, fn);
}

function authorDeleted(
    self: ReferenceManager,
    ref: Reference.Params,
    index: number
)
{
    const fn = () =>
    {
        ref.authors.names.splice(index, 1);
        self.forceUpdate();
    }

    return self.cacheOrRetrieve('authorDeleted', ref, index, fn);
}

// #endregion




/* * *
 * Controls: Buttons
 * * */

// #region

const buttonClass =
{
    className: 'icon button'
};
const buttonParams =
{
    ...buttonClass,
    size: '1.2em'
};

interface ButtonProps
{
    tab: ReferenceManager;
    id: string;
}


class PasteCitationButton
extends React.Component<ButtonProps>
{
    public render()
    {
        // tslint:disable-next-line:jsx-no-bind
        return <FaRegBookmark {...buttonParams} onClick={this.onClick} />;
    }

    public onClick = () =>
    {
        const index = state.pointToIndex(state.cursor);

        state.content =
            state.content.substring(0, index) +
            "&cite(" + this.props.id + ")" +
            state.content.substring(index);

        state.dispatchEvent(
            AppState.Event.ContentChange,
            { source: this }
        );
    }
}


class EditRefButton
extends React.Component<ButtonProps>
{
    public render()
    {
        return <FaRegEdit {...buttonParams} onClick={this.onClick} />;
    }

    public onClick = () =>
    {
        state.editingReference = this.props.id;
        this.props.tab.forceUpdate();
    }
}


class DeleteRefButton
extends React.Component<ButtonProps>
{
    public render()
    {
        return <FaRegTrashAlt {...buttonParams} onClick={this.onClick} />;
    }

    public onClick = () =>
    {
        const id = this.props.id;

        if (confirm("Opravdu chceš odstranit referenci ["+id+"]?"))
        {
            state.references.delete(id);
            this.props.tab.forceUpdate();
        }
    }
}


class NewRefButton
extends React.Component<ButtonProps>
{
    public render()
    {
        return <FaPlusCircle {...buttonClass} onClick={this.onClick} />;
    }

    public onClick = () =>
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

        this.props.tab.forceUpdate();
    }
}


class CloseEditButton
extends React.Component<ButtonProps>
{
    public render()
    {
        return <FaTimesCircle {...buttonClass} onClick={this.onClick} />;
    }

    public onClick = () =>
    {
        state.editingReference = undefined;
        this.props.tab.forceUpdate();
    }
}

// #endregion




/* * *
 * Tab
 * * */

// #region

class ReferenceManager extends Tab
{
    public static get title() { return 'References'; }
    public static get icon() { return FormatQuote; }

    public cacheOrRetrieve = LambdaCache();

    private RenderableEditor = genRenderable(this);



    public render()
    {
        return <div>
            <div className="ref-new">
                <NewRefButton tab={this} id='' />
                Nová reference
            </div>
            {
                Array.from( Iterable.map(state.references.values(),
                    r =>
                        state.editingReference === r.id
                        ? this.renderEditor(r)
                        : this.renderPreview(r)
                    )
                )
            }
        </div>;
    }

    private renderPreview(ref: Reference.Params)
    {
        const id = ref.id;
        const props = { tab: this, id };

        const node =
        <div key={hashObject(ref)} className="ref-body">

            <PasteCitationButton {...props} />
            <EditRefButton       {...props} />
            <DeleteRefButton     {...props} />

            <span>{`[${id}] `}</span>
            <Reference {...ref} />
        </div>;

        return node;
    }

    private renderEditor(ref: Reference.Params)
    {
        return (
        <div key={hashObject(ref)} className="ref-edit">

            <CloseEditButton tab={this} id='' />
            <span className="ref-edit-title">Editace reference [{ref.id}]</span>

            <table><tbody>
            {
                this.RenderableEditor.render(ref).map(el =>
                    <tr key={el.props['data-key']}>

                        <td><Ω c="reference" k={el.props['data-key']} /></td>

                        <td>{el}</td>

                    </tr>
                )
            }
            </tbody></table>
        </div>
        );
    }



    // Large-scale Events

    public onExternalChange = (e: Event) =>
    {
        if (e.source !== this) this.forceUpdate();
    }

    public componentDidMount()
    {
        state.addEventListener(
            AppState.Event.ContentChange,
            this.onExternalChange
        );
    }

    public componentWillUnmount()
    {
        state.removeEventListener(
            AppState.Event.ContentChange,
            this.onExternalChange
        );
    }
}

// #endregion



export default ReferenceManager;