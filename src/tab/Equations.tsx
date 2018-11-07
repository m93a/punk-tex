import * as React from 'react';
import * as math from 'mathjs';
import * as TexZilla from 'texzilla';
import { ui, editable, editable_, rendererArray } from '../lib/ui-decorators';
import { Iterable, LambdaCache } from '../lib/react-helpers';
import { InternalError } from '../lib/react-helpers/Error';
import Tab from './Tab';

import
{
    FaTimesCircle,
    FaRegBookmark,
    FaHashtag,
    FaEquals
}
from 'react-icons/fa';

import state from '../state';


type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type FocusEvent  = React.FocusEvent<HTMLInputElement>;




/* * *
 * Buttons
 * * */

// #region

class PasteEquation extends React.Component<React.SVGAttributes<SVGElement>>
{
    public render()
    {
        const props = Object.assign({ width: '1em', height: '1em' }, this.props);

        return <svg {...props}>
            <FaRegBookmark />
            <FaEquals size='0.5em' x='0.25em' y='0.1em' />
        </svg>
    }
}

class PasteIndex extends React.Component<React.SVGAttributes<SVGElement>>
{
    public render()
    {
        const props = Object.assign({ width: '1em', height: '1em' }, this.props);

        return <svg {...props}>
            <FaRegBookmark  />
            <FaHashtag size='0.5em' x='0.25em' y='0.1em' />
        </svg>
    }
}

// #endregion



/* * *
 * Controls
 * * */

// #region

class CODE {}
class TEX {}

type rendered = (update: ()=>void) => React.ReactNode;

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

                <input key={key}
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

                <input key={key}
                    placeholder={eqToTex(ref.lhs, ref.rhs)}
                    value={get()}

                    onFocus={cacheOrRetrieve(ref, 'tex', 'focus',
                    (e: FocusEvent) =>
                    {
                        if(get()) return;
                        e.target.value = eqToTex(ref.lhs, ref.rhs);
                    })}

                    onBlur={cacheOrRetrieve(ref, 'tex', 'blur',
                    (e: FocusEvent) =>
                    {
                        if (e.target.value === eqToTex(ref.lhs, ref.rhs))
                        {
                            set(undefined);
                            e.target.value = '';
                        }
                    })}

                    onChange={cacheOrRetrieve(ref, 'tex', 'change',
                    (e: ChangeEvent) =>
                    {
                        set(e.target.value);
                    })}
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
 * Main
 * * */

// #region

class Equation extends React.Component<{eq: SerializedEquation, onClick: ()=>void}>
{
    public render()
    {
        const eq = this.props.eq;

        return <span onClick={this.props.onClick} dangerouslySetInnerHTML={{
                    __html: TexZilla.toMathMLString(
                        eq.tex || (codeToTex(eq.lhs) + '=' + codeToTex(eq.rhs))
                    )
                }} />
    }
}

class EquationEditor extends React.Component<{id: string, update: () => void}>
{
    private update = () => this.forceUpdate();
    private closeEdit = () =>
    {
        state.editingEquation = undefined;
        this.props.update();
    };

    public render()
    {
        return <p>
            {
                SerializedEquation
                .render(state.equations.get(this.props.id)!) // render equation editor
                .map(x => x(this.update)) // pass the update function to the UI
            }
            <FaTimesCircle className='icon button' onClick={this.closeEdit} />
        </p>
    }
}



class Equations extends Tab<{preview: boolean}>
{
    public static get title() { return 'Equations' };

    private cacheOrRetrieve = LambdaCache();
    private update = () => this.forceUpdate();

    /** Current code of the equation in the "add" field */
    private currentEq: string = '';

    /** Is the code in the "add" field valid? */
    private valid = true;

    public render()
    {
        return <div>
            {
                Array.from(
                    Iterable.map(state.equations.entries(),  ([id, eq]) =>
                        this.renderRow(id, eq)
                    )
                )
            }
            { !this.props.preview &&
            <p>
                <input defaultValue={this.currentEq} onChange={this.validate} />
                <button onClick={this.onAdd}>Add</button>
            </p>
            }
        </div>;
    }

    private renderRow(id: string, eq: SerializedEquation)
    {
        return <p>
            <PasteEquation />
            <PasteIndex />
            {` [${id}] `}
            {
                state.editingEquation === id ?
                <EquationEditor key={id} id={id} update={this.update} /> :
                <Equation key={id} eq={eq} onClick={this.setEditing(id)} />
            }
        </p>
    }

    private validate = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const code = e.target.value;

        const validity = validateCode(code);
        e.target.setCustomValidity(validity);
        this.valid = !validity;

        if (!this.valid) return;

        this.currentEq = code;
        this.forceUpdate();
    }

    private setEditing = (id: string) =>
    {
        return this.cacheOrRetrieve(this, 'setEditing', id, () =>
        {
            if (this.props.preview) return;

            state.editingEquation = id;
            this.forceUpdate();
        })
    };

    private onAdd = () =>
    {
        if (!this.valid) return;

        const [name, eq] = this.currentEq.split('=');
        if (!name || !eq) return;

        let id = '';
        do
        {
            id = 'equation-'+Math.round(Math.random()*1000);
        } while (state.equations.has(id));

        state.equations.set(id, {lhs: name, rhs: eq});
        this.currentEq = '';
        this.forceUpdate();
    }
}

export default Equations;

// #endregion