import Iterable from '../react-helpers/Iterable';


// #region Obscure types

type typeString = "string" | "number" | "boolean" | "symbol" | "undefined" | "object" | "function";

type typeIndicator = typeString | ClassConstructor;

type fromTypeString<name extends typeString> =
    name extends "string"    ? string    :
    name extends "number"    ? number    :
    name extends "boolean"   ? boolean   :
    name extends "symbol"    ? symbol    :
    name extends "undefined" ? undefined :
    name extends "object"    ? object    :
    name extends "function"  ? Function  : never;

type fromTypeIndicator<T extends typeIndicator> =
    T extends typeString
    ? fromTypeString<T>
    : T extends {new (...p: any[]): infer C} ? C : never;

type typeArrayfromTypeIndicators<T extends typeIndicators> = {
    [K in number]: fromTypeIndicator<T[K]>
};

type fromTypeIndicators<T extends typeIndicators> = typeArrayfromTypeIndicators<T>[number];

// #endregion



// #region Reasonable internal types

interface ClassConstructor<P extends object = object>
{
    new (...p: any[]): any,
    prototype: P
}

const PROPERTIES = Symbol('ui:properties');
const TEMP       = Symbol('ui:temp');

type Properties<X> = Map<string, renderer<any, X>>;
type Temp = { key: string, type: typeIndicators }[];

interface RenderableClass<X> extends ClassConstructor
{
    [PROPERTIES]: Properties<X>;
    render(self: object): X[];
}

function isSetUp(ctor: ClassConstructor): ctor is RenderableClass<unknown>
{
    if (!( ctor[PROPERTIES] instanceof Map )) return false;

    return true;
}

// #endregion



// #region Exported types

export type typeIndicators = typeIndicator[];

export type renderer<T, X> = (get: () => T, set: (value: T) => void, key: string, self: any) => X;
export type rendererArray<X> = Array<[typeIndicators, renderer<any, X>]>; // FIXME do more type-checking

export type render<X> = () => X[];
export type staticRender<T, X> = (self: T) => X[];

// #endregion



// #region Implementation

/**
 * Class decorator that adds a static method `render(object): X[]`.
 * @template X - type that will be returned by the renderers, typically a JSX element
 * @param renderers - array containing pairs of type to be matched and its respective renderer
 * @see editable
 *
 * @example
 *
 * ```
 * // Custom caching function
 * function cacheOrRetrieve(){}
 *
 * const renderers =
 * [
 *     [
 *         ['string'],
 *         (get, set, key) =>
 *         <input
 *             key={key}
 *             value={ get() }
 *
 *             onChange={
 *                 cacheOrRetrieve(key, (e) =>
 *                 {
 *                     set(e.target.value);
 *                     form.forceUpdate();
 *                 })
 *             }
 *         />
 *     ],
 *     [
 *         ['boolean'],
 *         (get, set, key) =>
 *         <input
 *             key={key}
 *             type='checkbox'
 *             checked={ get() }
 *
 *             onChange={
 *                 cacheOrRetrieve(key, (e) =>
 *                 {
 *                     set(e.target.checked);
 *                     form.forceUpdate();
 *                 })
 *             }
 *         />
 *     ],
 * ]
 *
 * @ui(renderers)
 * class Person {}```
 */
export function ui<X>(renderers: rendererArray<X>)
{
    return <C extends ClassConstructor>(target: C) =>
    {
        class TargetType extends target {}

        const lambda: RenderableClass<X> = class Lambda extends target
        {
            public static [PROPERTIES]: Properties<X> = matchRenderers(Lambda, renderers);

            public static render(self: TargetType): X[]
            {
                if (!isSetUp(this)) throw TypeError('The class is not set up for UI rendering. Have you called @ui() on it?');

                const controls: X[] = [];

                for(const [key, rndr] of this[PROPERTIES])
                {
                    const get = () => self[key];
                    const set = <T>(value: T) => self[key] = value;
                    const ctrl = rndr(get, set, key, self);

                    controls.push(ctrl);
                }

                return controls;
            }
        };

        return Object.assign(target, { [PROPERTIES]: lambda[PROPERTIES], render: lambda.render });
    }
}

/**
 * Property decorator that marks the property as renderable and matches it with a type.
 * If you pass multiple arguments to editable, the resulting type will be a union of them.
 * The type you enter can be wider than the actual type of the propety. This way you can
 * mark properties that need a special renderer by a dummy class to differentiate them
 * from the others.
 *
 * @see ui
 *
 * @example
 *
 * ```
 * class ID {}
 *
 * @ui(renderers)
 * class Person {
 *     @editable('string')
 *     public name = "John Doe";
 *
 *     @editable('string', ID)
 *     public username = 'joe-dhon';
 *
 *     @editable(Date)
 *     public birth = Date('1982-01-01');
 * }```
 *
 */
export function editable<T extends typeIndicators>(...type: T)
{
    return function<C extends { [a in K]: fromTypeIndicators<T> }, K extends string>(target: C, key: K)
    {
        if (!target[TEMP]) target[TEMP] = [];

        (target[TEMP] as Temp).push({ type, key });
    }
}



function matchRenderers<X>(target: RenderableClass<X>, renderers: rendererArray<X>)
{
    if (!target.prototype[TEMP])
    throw new TypeError(`No editable property was found on class "${target.name}".`);

    const properties: Properties<X> = new Map();

    for (const {type, key} of target.prototype[TEMP] as Temp)
    {
        let rndr: renderer<any, any> | undefined;

        for (const rule of renderers)
        {
            if (!Iterable.areEqual(type, rule[0])) continue;

            rndr = rule[1];
            break;
        }


        if (!rndr)
        {
            outer:
            for (const rule of renderers)
            {
                for (const typePermutation of Iterable.permutations(rule[0]))
                {
                    if (!Iterable.areEqual(type, typePermutation)) continue;

                    rndr = rule[1];
                    break outer;
                }
            }

            if (!rndr)
            {
                const typeName = type.map(x => typeof x === 'string' ? x : x.name).join(', ');
                throw new TypeError(`Did not find a renderer for type [${typeName}] of property "${key}".`);
            }
            else
            {
                console.warn(
                    `Type of property "${key}" is listed in a different order than the type ${''
                    }of the corresponding renderer. This has a negative impact on performance, ${''
                    }consider listing the types in alphabetical order.`
                );
            }
        }


        properties.set(key, rndr);
    }
    return properties;
}

ui.isSetUp  = isSetUp;
ui.editable = editable;

export default ui;

// #endregion
