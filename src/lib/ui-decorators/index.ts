import Iterable from '../react-helpers/Iterable';


// #region Type-level errors
// For more information see Microsoft/TypeScript#23689

const OptionalUndefinedError = { 'TypeError: Optional parameter has to contain undefined in its type.': Symbol() };

// #endregion




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

type typeArrayfromTypeIndicators<T extends TypeIndicators> = {
    [K in number]: fromTypeIndicator<T[K]>
};

type fromTypeIndicators<T extends TypeIndicators> = typeArrayfromTypeIndicators<T>[number];

// #endregion



// #region Reasonable internal types

interface ClassConstructor<P extends object = object>
{
    new (...p: any[]): P,
    prototype: P
}

const PROPERTIES_EDIT = Symbol('ui:editableProperties');
const PROPERTIES_VIEW = Symbol('ui:viewableProperties');
const TEMP_EDIT  = Symbol('ui:tempEdit');
const TEMP_VIEW  = Symbol('ui:tempView');

type Properties<X> = Map<string, Renderer<any, X>>;
type Temp = { key: string, type: TypeIndicators }[];

interface RenderableClass<X> extends ClassConstructor
{
    [PROPERTIES_EDIT]: Properties<X>;
    renderEditor(self: object): X[];
}

function isSetUp(ctor: ClassConstructor): ctor is RenderableClass<unknown>
{
    if (!( ctor[PROPERTIES_EDIT] instanceof Map )) return false;

    return true;
}

// #endregion



// #region Exported types

export type TypeIndicators = typeIndicator[];

export type Renderer<T, X, O = any> = (get: () => T, set: (value: T) => void, key: string, self: O) => X;

export interface RendererList<X, O = any> extends Iterable<[TypeIndicators, Renderer<any, X, O>]> {}; // TODO do more type-checking

// #endregion



// #region Implementation

/**
 * Class decorator that adds a static methods `renderEditor(this): X[]` and `renderView(this): X[]`.
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
export function ui<X>(renderers: {view?: RendererList<X>, edit?: RendererList<X>}): <C extends ClassConstructor>(target: C) => any;
export function ui<X>({view = new Map(), edit = new Map()}: {view?: RendererList<X>, edit?: RendererList<X>})
{
    return <C extends ClassConstructor>(target: C) =>
    {
        return Object.assign(target, {
            [PROPERTIES_VIEW]: matchRenderers(target, TEMP_VIEW, view),
            [PROPERTIES_EDIT]: matchRenderers(target, TEMP_EDIT, edit)
        });
    }
}

/**
 * Property decorator that marks the property as renderable and matches it with a type.
 * If you pass multiple arguments to viewable, the resulting type will be a union of them.
 * The type you enter can be wider than the actual type of the propety. This way you can
 * mark properties that need a special renderer by a dummy class to differentiate them
 * from the others.
 *
 * The properties marked as viewable can be rendered by the static method `renderView`.
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
 *     @viewable('string')
 *     public name = "John Doe";
 *
 *     @viewable('string', ID)
 *     public username = 'joe-dhon';
 *
 *     @viewable(Date)
 *     public birth = Date('1982-01-01');
 * }```
 *
 */


export function viewable<T extends TypeIndicators>(...type: T)
{
    return function<C extends { [a in K]: fromTypeIndicators<T> }, K extends string>(target: C, key: K)
    {
        if (!target[TEMP_VIEW]) target[TEMP_VIEW] = [];

        (target[TEMP_VIEW] as Temp).push({ type, key });
    }
}


/**
 * Exactly like `@viewable`, but the properties marked as editable
 * are rendered by `renderEditor`, rather than `renderView`.
 *
 * @see viewable
 */
export function editable<T extends TypeIndicators>(...type: T)
{
    return function<C extends { [a in K]: fromTypeIndicators<T> }, K extends string>(target: C, key: K)
    {
        if (!target[TEMP_EDIT]) target[TEMP_EDIT] = [];

        (target[TEMP_EDIT] as Temp).push({ type, key });
    }
}


/**
 * Exactly like `@viewable`, but for optional parameters.
 *
 * The type must contain `'undefined'`.
 * @see editable
 */
export function viewable_<T extends TypeIndicators>(...type: T)
{
    return function<
        C extends
            undefined extends fromTypeIndicators<T>
            ? { [a in K]?: fromTypeIndicators<T> }
            : typeof OptionalUndefinedError,
        K extends string
    >(
        target: C, key: K
    )
    {
        if (!target[TEMP_VIEW]) target[TEMP_VIEW] = [];

        (target[TEMP_VIEW] as Temp).push({ type, key });
    }
}


/**
 * Exactly like `@editable`, but for optional parameters.
 *
 * The type must contain `'undefined'`.
 * @see editable
 */
export function editable_<T extends TypeIndicators>(...type: T)
{
    return function<
        C extends
            undefined extends fromTypeIndicators<T>
            ? { [a in K]?: fromTypeIndicators<T> }
            : typeof OptionalUndefinedError,
        K extends string
    >(
        target: C, key: K
    )
    {
        if (!target[TEMP_EDIT]) target[TEMP_EDIT] = [];

        (target[TEMP_EDIT] as Temp).push({ type, key });
    }
}



function matchRenderers<X>(target: ClassConstructor, ACCESSOR: symbol, renderers: RendererList<X>)
{
    const rendererMap = new Map(renderers);
    const properties: Properties<X> = new Map();

    if (!target.prototype[ACCESSOR])
    return properties;

    for (const {type, key} of target.prototype[ACCESSOR] as Temp)
    {
        let rndr: Renderer<any, any> | undefined;

        for (const rule of rendererMap)
        {
            if (!Iterable.areEqual(type, rule[0])) continue;

            rndr = rule[1];
            break;
        }


        if (!rndr)
        {
            outer:
            for (const rule of rendererMap)
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

    delete target.prototype[ACCESSOR];
    return properties;
}

function renderFactoryFactory(KEY: symbol)
{
    return function renderSomethingFactory<T extends ClassConstructor, X, R>(fn: (this: T, nodes: X[]) => R)
    {
        return function renderSomething(this: T, target: InstanceType<T>): R
        {
            if (!isSetUp(this)) throw TypeError('The class is not set up for UI rendering. Have you called @ui() on it?');

            const nodes: X[] = [];

            for(const [key, rndr] of this[KEY])
            {
                const get = () => target[key];
                const set = <U>(value: U) => target[key] = value;
                const node = rndr(get, set, key, target);

                nodes.push(node);
            }

            return fn.call(this, nodes);
        }

    }
}

/**
 * Create a renderView method.
 * @template T - constructor of the renderable class
 * @template X - type of nodes returned by the renderers
 * @template R - the return type of `fn`
 * @param fn - takes the nodes X[] rendered by renderers and outputs the required result R
 * @returns function which takes an instance of T and renders it as R.
 * @example
 * ```
 * @ui(renderers)
 * class People
 * {
 *   public readonly renderView = renderViewFactory<
 *     typeof People,
 *     React.ReactNode,
 *     React.Element
 *   >(
 *     nodes => <div>{nodes}</div>
 *   )
 *
 *    // ... properties
 * }```
 */
export const renderViewFactory = renderFactoryFactory(PROPERTIES_VIEW);


/**
 * Create a renderEditor method.
 * @template T - constructor of the renderable class
 * @template X - type of nodes returned by the renderers
 * @template R - the return type of `fn`
 * @param fn - takes the nodes X[] rendered by renderers and outputs the required result R
 * @returns function which takes an instance of T and renders it as R.
 * @example
 * ```
 * @ui(renderers)
 * class People
 * {
 *   public readonly renderEditor = renderEditorFactory<
 *     typeof People,
 *     React.ReactNode,
 *     React.Element
 *   >(
 *     nodes => <div>{nodes}</div>
 *   )
 *
 *    // ... properties
 * }```
 */
export const renderEditFactory = renderFactoryFactory(PROPERTIES_EDIT);

ui.isSetUp  = isSetUp;

ui.editable = editable;
ui.editable_ = editable_;
editable._ = editable_;

ui.viewable = viewable;
ui.viewable_ = viewable_;
viewable._ = viewable_;

ui.renderViewFactory = renderViewFactory;
ui.renderEditFactory = renderEditFactory;

export default ui;

// #endregion
