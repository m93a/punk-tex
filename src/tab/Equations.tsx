import * as React from 'react';
import * as math from 'mathjs';
import * as TexZilla from 'texzilla';
import { ui, editable, editable_, rendererArray } from '../lib/ui-decorators';
import { Iterable, LambdaCache, hashObject } from '../lib/react-helpers';
import { InternalError } from '../lib/react-helpers/Error';
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

export type EquationStringName = 'id'|'code'|'tex';


type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type FocusEvent  = React.FocusEvent<HTMLInputElement>;





/* * *
 * Controls: Editor
 * * */

// #region

class ID {}
class CODE {}
class TEX {}

type rendered = (update: ()=>void) => React.ReactElement<{'data-key': EquationStringName}>;

@ui(getRenderers())
export class SerializedEquation
{
    public static render(eqn: SerializedEquation): rendered[]
    {
        throw new InternalError(
            "The static 'render' method wasn't correctly overriden. This shouldn't have happened."
        );
    }

    // tslint:disable:member-access

    @editable('string', ID) id: string = '';
    @editable('string', CODE) lhs: string = ''; rhs: string = '';
    @editable_('string', TEX) tex?: string;

    // tslint:enable:member-access
}

function getRenderers(): rendererArray<rendered, SerializedEquation>
{
    const cacheOrRetrieve = LambdaCache();

    return [
        [
            ['string', CODE],
            (get, set, key, ref) =>
            (updateParent) =>

                <input
                    key={key}
                    data-key='code'
                    defaultValue={eqToCode(ref.lhs, ref.rhs)}

                    onBlur={cacheOrRetrieve(ref, 'code', 'blur', (e: FocusEvent) => e.target.value = `${ref.lhs} = ${ref.rhs}`)}

                    onChange={cacheOrRetrieve(ref, 'code', 'click',
                    (e: ChangeEvent) =>
                    {
                        const code = e.target.value;
                        const validity = validateCode(code);
                        e.target.setCustomValidity(validity);

                        if (!validity)
                        {
                            [ref.lhs, ref.rhs] = code.split('=').map(s => s.trim());
                            updateParent();
                        }
                    })}
                />

        ],

        [
            ['string', TEX],
            (get, set, key, ref) =>
            (updateParent) =>

                // ! @RisaI
                // až to budeš portovat do MaterialUI, přidej prosím na tenhle
                // input takový to clear button, jako je u <input type=search />

                <input
                    key={key}
                    data-key={key}
                    placeholder={eqToTex(ref.lhs, ref.rhs)}
                    value={get()}

                    onFocus={cacheOrRetrieve(ref, key, 'focus',
                    (e: FocusEvent) =>
                    {
                        if(get()) return;
                        e.target.value = eqToTex(ref.lhs, ref.rhs);
                    })}

                    onBlur={cacheOrRetrieve(ref, key, 'blur',
                    (e: FocusEvent) =>
                    {
                        if (e.target.value === eqToTex(ref.lhs, ref.rhs))
                        {
                            set(undefined);
                            e.target.value = '';
                        }
                    })}

                    onChange={cacheOrRetrieve(ref, key, 'change',
                    (e: ChangeEvent) =>
                    {
                        set(e.target.value);
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
                        const eqns = state.equations;

                        if (id2 !== id1 && eqns.has(id2))
                        {
                            e.target.setCustomValidity('Cannot change id – this identifier is already in use.');
                            return;
                        }
                        else
                        {
                            e.target.setCustomValidity('');
                        }

                        set(id2);
                        eqns.set(id2, ref);
                        eqns.delete(id1);
                        state.editingEquation = id2;
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

function validateCode(code: string)
{

    if (!code.includes('='))
    {
        return 'The equation doesn\'t contain the `=` sign.';
    }
    else
    {
        let failed: boolean = false;

        try
        {
            const [lhs, rhs] = code.split('=');
            math.parse(rhs);
            failed = !math.parse(lhs).isSymbolNode;
        }
        catch(err){
            return (err as Error).message;
        }

        if(failed)
        {
            return 'The LHS has to be a variable.';
        }
        else
        {
            return '';
        }
    }
}

function eqToCode(lhs: string, rhs: string)
{
    return `${lhs.trim()} = ${rhs.trim()}`;
}

function eqToTex(lhs: string, rhs: string)
{
    return `${codeToTex(lhs.trim()).trim()} = ${codeToTex(rhs.trim()).trim()}`;
}

const codeToTex = (function()
{
    let lastCode: string = '';
    let lastTex: string = '';

    return function(code: string)
    {
        if (code === lastCode) return lastTex;

        lastTex = math.parse(code).toTex();
        lastCode = code; // if parse() doesn't throw

        return lastTex;
    }
})();

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
    tab: EquationManager;
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

        state.content =
            state.content.substring(0, index) +
            "&eq(" + this.props.id + ")" +
            state.content.substring(index);

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

        state.content =
            state.content.substring(0, index) +
            "&eqref(" + this.props.id + ")" +
            state.content.substring(index);

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
        state.editingEquation = this.props.id;
        this.props.tab.update();
        console.log(state);
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

        if (confirm("Opravdu chceš odstranit referenci ["+id+"]?"))
        {
            state.equations.delete(id);
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
            id = 'equation-'+((Math.random()*1000)|0);
        }
        while(state.equations.has(id));

        const ref: SerializedEquation =
        {
            id,
            lhs: 'a',
            rhs: 'b'
        };

        state.equations.set(id, ref);
        state.editingEquation = id;

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
        state.editingEquation = undefined;
        this.props.tab.update();
    }
}

// #endregion




/* * *
 * Main
 * * */

// #region

class EquationManager extends Tab<{preview: boolean}>
{
    public static get title() { return 'Equations' };

    public update = () =>
    {
        console.log(state.editingEquation);
        this.forceUpdate();
    }

    public render()
    {
        return <div className={this.props.preview ? 'preview' : ''}>

            { !this.props.preview &&
            <div className="ref-new">
                <NewEqButton tab={this} id='' />
                Nová reference
            </div>
            }

            {
                Array.from( Iterable.map(state.equations.entries(),
                    ([id, eq]) =>
                        this.props.preview
                            ? this.renderPreview(id, eq)

                        : state.editingEquation === eq.id
                            ? this.renderEditor(id, eq)
                            : this.renderPreview(id, eq)
                    )
                )
            }

        </div>;
    }

    private renderPreview(id: string, eq: SerializedEquation)
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
                __html: TexZilla.toMathMLString(
                    eq.tex || (codeToTex(eq.lhs) + '=' + codeToTex(eq.rhs))
                )
            }} />
        </div>;

        return node;
    }



    private renderEditor(id: string, eq: SerializedEquation)
    {
        return (
        <div key={hashObject(eq)} className="ref-edit">

            <CloseEditButton tab={this} id='' />
            <span className="ref-edit-title">Editace rovnice [{id}]</span>

            <table><tbody>
            {
                SerializedEquation
                .render(state.equations.get(id)!) // render equation editor
                .map(x => x(this.update)) // pass the update function to the UI
                .map(el =>
                    <tr key={el.props['data-key']}>

                        <td><Ω c="equation" k={el.props['data-key']} /></td>

                        <td>{el}</td>

                    </tr>
                )
            }
            </tbody></table>
        </div>
        );
    }
}

export default EquationManager;

// #endregion