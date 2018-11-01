import * as React from 'react';
import * as math from 'mathjs';
import * as TexZilla from 'texzilla';
import { Iterable } from '../lib/react-helpers';
import Tab from './Tab';

import state from '../state';

export interface SerializedEquation
{
    lhs: string;
    rhs: string;
    tex?: string;
}

class Equation extends React.Component<{eq: SerializedEquation, onClick: ()=>void}>
{
    public render()
    {
        const eq = this.props.eq;

        return <p>
            <span onClick={this.props.onClick} dangerouslySetInnerHTML={{
                __html: eq.tex || TexZilla.toMathMLString(
                    math.parse(eq.lhs).toTex() + '=' + math.parse(eq.rhs).toTex()
                )
            }} />
        </p>
    }
}

class Equations extends Tab
{
    public static get title() { return 'Equations' };

    private currentEq: string = '';
    private valid = true;

    public render()
    {
        return <div>
            {
                Iterable.map(state.equations.entries(),  ([id, eq], i) =>
                    <Equation key={id} eq={eq} onClick={this.onClick} />
                )
            }
            <p>
                <input value={this.currentEq} onChange={this.onChange} />
                <button onClick={this.onAdd}>Add</button>
            </p>
        </div>;
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const value = e.target.value;
        this.valid = false;

        if (!value.includes('='))
        {
            e.target.setCustomValidity('The equation doesn\'t contain the `=` sign.');
        }
        else
        {
            let failed: boolean = false;

            try
            {
                failed = !!math.parse(value.split('=')[0]).isSymbolNode;
            }
            catch(F){}

            if(failed)
            {
                e.target.setCustomValidity('The LHS has to be a variable and RHS a valid expression.');
            }
            else
            {
                e.target.setCustomValidity('');
                this.valid = true;
            }
        }

        this.currentEq = value;
        this.forceUpdate();
    }

    private onClick = () =>
    {

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