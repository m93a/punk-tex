import Iterable from '../react-helpers/Iterable';

interface ClassConstructor<P extends Class = Class>
{
    new (...p: any[]): any,
    prototype: P
}

interface Class
{
    constructor: Function
}

type typeList = "string" | "number" | "boolean" | "symbol" | "undefined" | "object" | "function";

type typeIndicator = typeList | ClassConstructor;

type fromTypeString<name extends typeList> =
    name extends "string"    ? string    :
    name extends "number"    ? number    :
    name extends "boolean"   ? boolean   :
    name extends "symbol"    ? symbol    :
    name extends "undefined" ? undefined :
    name extends "object"    ? object    :
    name extends "function"  ? Function  : never;

type fromTypeIndicator<T extends typeIndicator> =
    T extends typeList ? fromTypeString<T> : T extends {new (...p: any[]): infer C} ? C : never;

type typeArrayfromTypeIndicatorArray<T extends typeIndicator[]> = {
    [K in number]: fromTypeIndicator<T[K]>
};

type fromTypeIndicatorArray<T extends typeIndicator[]> = typeArrayfromTypeIndicatorArray<T>[number];

export type renderer<T, X> = (get: () => T, set: (value: T) => void, key: string, self: any) => X;


export type rendererArray<X> = Array<[typeIndicator[], renderer<any, X>]>; // FIXME
/*
type rendererArray<X, T extends typeIndicator[]> = {
    [K in number]: T[K] extends typeIndicator ? [T[K], fromTypeIndicator<T[K]>] : never
};

const foo =
[
    ['string', (a: string) => Symbol()],
    [Date, (a: Date) => Symbol()],
];
*/


const PROPERTIES = Symbol('ui:properties');
const RENDERERS  = Symbol('ui:renderers');

interface PropertyInfo<X>
{
    type: typeIndicator[];
    renderer: renderer<any, X>;
}

export interface RenderableClass<X>
{
    [PROPERTIES]: Map<string, PropertyInfo<X>>;
    [RENDERERS]:  rendererArray<X>;

    render(): X[];
}

export function isSetUp(prototype: {}): prototype is RenderableClass<any>
{
    if (!( self[PROPERTIES] instanceof Map )) return false;

    if (!Array.isArray(self[RENDERERS])) return false;

    return true;
}

export type render<X> = () => X[];
export type staticRender<T, X> = (self: T) => X[];


export function ui<X>(renderers: rendererArray<X>)
{
    console.log('UI factory')
    return <C extends ClassConstructor>(target: C) =>
    {
        console.log('UI decorator');
        class TargetType extends target {}

        const lambda = class extends target implements RenderableClass<X>
        {
            public [PROPERTIES] = new Map();
            public [RENDERERS] = renderers;

            public render: render<X> = this.render.bind(this, target);
            public static render(self: TargetType): X[]
            {
                if (!isSetUp(this)) throw TypeError('The class is not set up for UI rendering. Have you called @ui() on it?');

                const controls: X[] = [];

                for(const [key, info] of this[PROPERTIES])
                {
                    const get = () => self[key];
                    const set = <T>(value: T) => self[key] = value;
                    const ctrl = info.renderer(get, set, key, self);

                    controls.push(ctrl);
                }

                return controls;
            }
        };

        (window as any).ui = { target, lambda };

        return lambda;
    }
}

export function editable<T extends typeIndicator[]>(...type: T)
{
    return function<C extends { [a in K]: fromTypeIndicatorArray<T> }, K extends string>(target: C, key: K)
    {
        if (!isSetUp(target))
        throw TypeError('The class is not set up for UI rendering. Have you called @ui() on it?');

        // tslint:disable-next-line:no-shadowed-variable see palantir/tslint#4247
        let renderer: renderer<any, any> | undefined;

        for (const rule of target[RENDERERS])
        {
            if (!Iterable.areEqual(type, rule[0])) continue;

            renderer = rule[1];
            break;
        }


        if (!renderer)
        {
            outer:
            for (const rule of target[RENDERERS])
            {
                for (const typePermutation of Iterable.permutations(rule[0]))
                {
                    if (!Iterable.areEqual(type, typePermutation)) continue;

                    renderer = rule[1];
                    break outer;
                }
            }

            if (!renderer)
            {
                const typeString = type.map(x => typeof x === 'string' ? x : x.name).join(', ');
                throw new TypeError(`Did not find a renderer for type [${typeString}] of property "${key}".`);
            }
            else
            {
                console.warn(
                    `Type of property "${key}$ is listed in a different order than the type ${''
                    }of the corresponding renderer. This has a negative impact on performance, ${''
                    }consider listing the types in alphabetical order.`
                );
            }
        }


        target[PROPERTIES].set(key, { type, renderer });
    }
}

ui.isSetUp  = isSetUp;
ui.editable = editable;

export default ui;