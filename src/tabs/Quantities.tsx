import * as React from 'react';
import { ui, editable, editable_, rendererArray } from '../lib/ui-decorators';
import { Iterable, LambdaCache, hashObject } from '../lib/react-helpers';
import { InternalError } from '../lib/react-helpers/Error';
import parseTex from '../lib/LaTeX2MathML';
import Tab from './Tab';

import
{
    FaTimesCircle,
    FaRegBookmark,
    FaHashtag,
    FaEquals,
    FaRegEdit,
    FaRegTrashAlt,
    FaPlusCircle
}
from 'react-icons/fa';

import { AppState, state } from '../state';
import { Ω } from 'src/lang';

export type QuantityStringName = 'id'|'name'|'tex';


type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type FocusEvent  = React.FocusEvent<HTMLInputElement>;




/* * *
 * Controls: Editor
 * * */

// #region

class ID {}
class NAME {}
class TEX {}

type rendered = (update: ()=>void) => React.ReactElement<{'data-key': QuantityStringName}>;

@ui(getRenderers())
export class Quantity
{
    public static render(eqn: Quantity): rendered[]
    {
        throw new InternalError(
            "The static 'render' method wasn't correctly overriden. This shouldn't have happened."
        );
    }

    // tslint:disable:member-access

    @editable('string', ID) id: string = '';
    @editable_('string', NAME) name?: string;
    @editable_('string', TEX) tex?: string;

    // tslint:enable:member-access
}

function getRenderers(): rendererArray<rendered, Quantity>
{
    const cacheOrRetrieve = LambdaCache();

    return [
        [
            ['string', NAME],
            (get, set, key, ref) =>
            (updateParent) =>

                <input
                    key={key}
                    data-key={key}
                    defaultValue={get() || ''}
                    placeholder={ref.id}

                    onBlur={cacheOrRetrieve(ref, 'name', 'blur',
                    (e: FocusEvent) =>
                    {
                        e.target.value = get() || '';
                    })}

                    onChange={cacheOrRetrieve(ref, 'name', 'click',
                    (e: ChangeEvent) =>
                    {
                        set(e.target.value || undefined);
                    })}
                />

        ],

        [
            ['string', TEX],
            (get, set, key, ref) =>
            (updateParent) =>

                <input
                    key={key}
                    data-key={key}
                    defaultValue={get() || ''}
                    placeholder={ref.id[0]}

                    onBlur={cacheOrRetrieve(ref, key, 'blur',
                    (e: FocusEvent) =>
                    {
                        e.target.value = ref.tex || '';
                    })}

                    onChange={cacheOrRetrieve(ref, key, 'change',
                    (e: ChangeEvent) =>
                    {
                        set(e.target.value || undefined);
                        updateParent();
                    })}
                />

        ],




        [
            ['string', ID],
            (get, set, key, ref) =>
            (updateParent) =>
            <input
                key={key}
                data-key={key}
                defaultValue={ get() }

                onChange={
                    cacheOrRetrieve('change', ref, key, (e: ChangeEvent) =>
                    {
                        const id1 = get();
                        const id2 = e.target.value;
                        const qnts = state.project.quantities;

                        if (id2 !== id1 && qnts.has(id2))
                        {
                            e.target.setCustomValidity('Cannot change id – this identifier is already in use.');
                            return;
                        }
                        else
                        {
                            e.target.setCustomValidity('');
                        }

                        set(id2);
                        qnts.set(id2, ref);
                        qnts.delete(id1);
                        state.editingQuantity = id2;
                        updateParent();
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
        ]
    ];
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
    tab: QuantityManager;
    id: string;
}


class PasteEquationButton extends React.Component<ButtonProps>
{
    public render()
    {
        return <svg width='1em' height='1em' {...buttonParams} onClick={this.onClick}>
            <FaRegBookmark />
            <FaEquals size='0.5em' x='0.25em' y='0.1em' />
        </svg>
    }

    public onClick = () =>
    {
        const index = state.pointToIndex(state.cursor);

        state.project.content =
            state.project.content.substring(0, index) +
            "&Eq(" + this.props.id + ")" +
            state.project.content.substring(index);

        state.dispatchEvent(
            AppState.Event.ContentChange,
            { source: this }
        );
    }
}

class PasteIndexButton extends React.Component<ButtonProps>
{
    public render()
    {
        return <svg width='1em' height='1em' {...buttonParams} onClick={this.onClick}>
            <FaRegBookmark  />
            <FaHashtag size='0.5em' x='0.25em' y='0.1em' />
        </svg>
    }

    public onClick = () =>
    {
        const index = state.pointToIndex(state.cursor);

        state.project.content =
            state.project.content.substring(0, index) +
            "&eqref(" + this.props.id + ")" +
            state.project.content.substring(index);

        state.dispatchEvent(
            AppState.Event.ContentChange,
            { source: this }
        );
    }
}

class EditEqButton extends React.Component<ButtonProps>
{
    public render()
    {
        return <FaRegEdit {...buttonParams} onClick={this.onClick} />;
    }

    public onClick = () =>
    {
        state.editingQuantity = this.props.id;
        this.props.tab.update();
    }
}

class DeleteEqButton
extends React.Component<ButtonProps>
{
    public render()
    {
        return <FaRegTrashAlt {...buttonParams} onClick={this.onClick} />;
    }

    public onClick = () =>
    {
        const id = this.props.id;

        if (confirm("Opravdu chceš odstranit veličinu ["+id+"]?"))
        {
            state.project.quantities.delete(id);
            this.props.tab.update();
        }
    }
}


class NewEqButton
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
            id = 'quantity-'+((Math.random()*1000)|0);
        }
        while(state.project.quantities.has(id));

        const ref: Quantity = { id };

        state.project.quantities.set(id, ref);
        state.editingQuantity = id;

        this.props.tab.update();
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
        state.editingQuantity = undefined;
        this.props.tab.update();
    }
}

// #endregion




/* * *
 * Main
 * * */

// #region

class QuantityManager extends Tab<{preview: boolean}>
{
    public static get title() { return 'Quantities' };

    public update = () =>
    {
        this.forceUpdate();
    }

    public render()
    {
        return <div className={this.props.preview ? 'preview' : ''}>

            { !this.props.preview &&
            <div className="ref-new">
                <NewEqButton tab={this} id='' />
                Nová veličina
            </div>
            }

            {
                Array.from( Iterable.map(state.project.quantities.entries(),
                    ([id, qty]) =>
                        this.props.preview
                            ? this.renderPreview(id, qty)

                        : state.editingQuantity === qty.id
                            ? this.renderEditor(id, qty)
                            : this.renderPreview(id, qty)
                    )
                )
            }

        </div>;
    }

    private renderPreview(id: string, eq: Quantity)
    {
        const props = { tab: this, id };

        const node =
        <div key={hashObject(eq)} className="ref-body">

            <PasteEquationButton {...props} />
            <PasteIndexButton    {...props} />

            {!this.props.preview &&
            <>
                <EditEqButton       {...props} />
                <DeleteEqButton     {...props} />
            </>
            }

            <span onClick={this.update}>{`[${id}] `}</span>
            <span dangerouslySetInnerHTML={{
                __html: parseTex( eq.tex || eq.id[0] )
            }} />
        </div>;

        return node;
    }



    private renderEditor(id: string, eq: Quantity)
    {
        return (
        <div key={hashObject(eq)} className="ref-edit">

            <CloseEditButton tab={this} id='' />
            <span className="ref-edit-title">Editace veličiny [{id}]</span>

            <table><tbody>
            {
                Quantity
                .render(state.project.quantities.get(id)!) // render quantity editor
                .map(x => x(this.update)) // pass the update function to the UI
                .map(el =>
                    <tr key={el.props['data-key']}>

                        <td><Ω c="quantity" k={el.props['data-key']} /></td>

                        <td>{el}</td>

                    </tr>
                )
            }
            </tbody></table>
        </div>
        );
    }
}

export default QuantityManager;

// #endregion