import * as React from 'react';
import * as math from 'mathjs';
import * as TexZilla from 'texzilla';
import Tab from './Tab';

class Equations extends Tab
{
    public static get title() { return 'Equations' };

    private eqns: [math.MathNode, math.MathNode][] = [];
    private currentEq: string = '';

    public render()
    {
        return <div>
            {
                this.eqns.map( ([name, eq], i) =>
                    <p key={i}>
                        <span dangerouslySetInnerHTML={{
                            __html: TexZilla.toMathMLString(
                                name.toTex() + '=' + eq.toTex()
                            )
                        }} />
                    </p>
                )
            }
            <p>
                <input value={this.currentEq} onChange={this.onChange} />
                <button onClick={this.onClick}>Add</button>
            </p>
        </div>;
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        this.currentEq = e.target.value;
        this.forceUpdate();
    }

    private onClick = () =>
    {
        const [name, eq] = this.currentEq.split('=');
        this.eqns.push([ math.parse(name), math.parse(eq) ]);
        this.currentEq = '';
        this.forceUpdate();
    }
}

export default Equations;