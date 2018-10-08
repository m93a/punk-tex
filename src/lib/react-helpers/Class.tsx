
import Iterables from './Iterable';
import Sets from './Set';



export function hasOwnProperty (obj: object, prop: PropertyKey)
{
    return Object.prototype.hasOwnProperty.call(obj, prop) as boolean;
}


export function callOrNot<R = any, T extends Array<any> = Array<any>>(fn: (...args: T) => R, ...args: T): R;
export function callOrNot<R = any, T extends Array<any> = Array<any>>(fn: undefined | ((...args: T) => R), ...args: T): R | undefined;
export function callOrNot<R = any, T extends Array<any> = Array<any>>(fn?: (...args: T) => R, ...args: T)
{
    return fn ? fn(...args) : undefined;
}



/**
 * The value of `obj[MixinSet]` is either undefined (when `obj` has no mixins)
 * or a `Set` containing all the mixins of `obj` and its prototypes.
 */
const MixinSet = Symbol('Mixins');



export interface Ctor extends Function
{
    prototype: object;
}

export interface Constructor extends Ctor
{
    prototype: Constructor.Prototype;
    new (...args: any[]): object;
}

export namespace Constructor
{
    export interface Prototype
    {
        [MixinSet]?: Set<Prototype>;
    }

    export function is(ctor: Ctor)
    {
        return typeof ctor === 'function' && typeof ctor.prototype === 'object';
    }
}





/**
 * Checks whether the constructor `parent` either equals the constructor `subClass`,
 * or is contained in its prototype chain as a prototype or mixin.
 */
export function isSubclassOf<T extends Ctor>(subclass: Ctor, parent: T): subclass is T
{
    if (!Constructor.is(subclass) || !Constructor.is(parent))
    {
        throw new TypeError('One of the arguments was not a constructor.');
    }
    
    function isSubprototype(subproto: Constructor.Prototype): boolean
    {
        if (subproto === parent.prototype || subproto instanceof parent)
        {
            return true;
        }

        const mixins = subclass.prototype[MixinSet];
        
        if (mixins instanceof Set)
        {
            return Iterables.some(mixins, (subsub) => isSubprototype(subsub));
        }
        

        return false;
    }

    return isSubprototype(subclass.prototype);
    
}





// This is needed because of interdependence of Tree and Vertex
// tslint:disable-next-line:variable-name
let Vertex__hack: any;

class Tree<T>
{
    public nodes:  Map<T, Vertex<T>> = new Map();
    public roots:  Set<Vertex<T>>    = new Set();
    public leaves: Set<Vertex<T>>    = new Set();

    public createVertex(key: T): Vertex<T>
    {
        const known = this.nodes.get(key);
        return known ? known : new Vertex__hack(this, key);
    }
}

class Vertex<T>
{
    public tree: Tree<T>;
    public key: T;
    public parent: Vertex<T> | null = null;
    public children: Set<Vertex<T>> = new Set();

    constructor(tree: Tree<T>, key: T)
    {
        this.tree = tree;
        this.key = key;

        tree.nodes.set(key, this);
        tree.roots.add(this);
        tree.leaves.add(this);
    }

    public changeKey(newKey: T)
    {
        this.tree.nodes.delete(this.key);
        this.tree.nodes.set(newKey, this);
        this.key = newKey;
    }

    public addChild(key: T): Vertex<T>
    {
        let child = this.tree.nodes.get(key);

        if (!child)
        {
            child = new Vertex(this.tree, key);
        }

        if (child.parent)
        {
            throw new TypeError('The child already exists and has a parent.');
        }


        this.tree.roots.delete(child);
        this.children.add(child);

        this.tree.leaves.delete(this);
        child.parent = this;

        return child;
    }

    public addParent(key: T): Vertex<T>
    {
        let parent = this.tree.nodes.get(key);

        if (!parent)
        {
            parent = new Vertex(this.tree, key);
        }

        if (this.parent)
        {
            throw new TypeError('This Vertex already has a parent.');
        }
        

        parent.tree.roots.delete(this);
        parent.children.add(this);

        this.tree.leaves.delete(parent);
        this.parent = parent;

        return parent;
    }

    public remove(): void
    {
        if (this.parent)
        {
            this.parent.children.delete(this);

            if (this.parent.children.size === 0)
            {
                this.tree.leaves.add(this.parent);
            }
        }

        this.children.forEach(c =>
        {
            c.parent = null;
            this.tree.roots.add(c);
        });

        this.tree.nodes.delete(this.key);

        this.tree = new Tree();
        this.parent = null;
        this.children = new Set();
    }
}

Vertex__hack = Vertex;



class IncompatiblePropertiesError extends TypeError
{
    constructor(keyName: string)
    {
        super('The objects being merged are not disjunct, they share a common property: ' + keyName);
    }
}


function createPrototypeTree(obj: object, ...objs: object[]): Tree<object>
{
    objs.push(obj);
    const tree = new Tree<object>();

    
    objs.forEach( (c: object|null) =>
    {
        let v = tree.createVertex(c as object);
        while (c = Object.getPrototypeOf(c) as object|null)
        {
            if (v.parent)
            {
                if (v.parent.key !== c)
                {
                    // FIXME this also happens when you try to merge both a parent and its child at the same time
                    throw new Error(
                        'The tree was modified while processing! ' +
                        '(Or one of the objects is included in the ' +
                        'prototype chain of another one.)'
                    );
                }
                else
                {
                    break;
                }
            }
            else
            {
                v = v.addParent(c);
            }
        }
    });
    

    return tree;
}

function copyAllOwnProps(to: object, from: object, callback?: (p: string) => void)
{
    Object.getOwnPropertyNames(from).forEach(p =>
    {
        if (callback)
        {
            callback(p);
        }

        Object.defineProperty(to, p, Object.getOwnPropertyDescriptor(from, p) as PropertyDescriptor);
    });
}

/** Merges multiple Vertex<object>'s into one object and removes them from the tree.  */
function mergeSetOfObjects(nodes: Set<Vertex<object>>): object
{
    const merged = Object.create(null);

    nodes.forEach(c =>
    {
        copyAllOwnProps(merged, c.key, p =>
        {
            if (p in merged && p !== 'constructor')
            {
                throw new IncompatiblePropertiesError(p);
            }
        });

        c.remove();
    });

    return merged;
}

/**
 * Given a Vertex<object> with children that are disjunct objects, this method merges them
 * into one node containing an object with all the properties of the individual nodes.
 */
function mergeDerivedObjects(v: Vertex<object>): void
{
    if (v.children.size === 0)
    {
        return;
    }

    v.children.forEach( c => mergeDerivedObjects(c) );

    const overrides = mergeSetOfObjects(v.children);

    const old = v.key;
    v.changeKey(Object.create(null));
    copyAllOwnProps(v.key, old);
    copyAllOwnProps(v.key, overrides);
}

/**
 * Creates an object that inherits from `derived`'s prototype
 * and contains properties from all mixin bases.
 */
function produceMixinPrototype(derived: object, bases: object[]): object
{
    const tree = createPrototypeTree(derived, ...bases);
    const derivedNode = tree.nodes.get(derived) as Vertex<object>;


    // Loop through the spine nodes (ie. the prototype chain of derived)
    // and push them into the spineNodes array.

    const spineNodes = [ derivedNode ];
    let proto = Object.getPrototypeOf(derived) as object|null;

    if (proto)
    {
        do
        {
            const protoNode = tree.nodes.get(proto) as Vertex<object>;
            spineNodes.push(protoNode);
        }
        while (proto = Object.getPrototypeOf(proto) as object|null);
    }

    

    // Create an universal root, so that even completely disjunct prototype
    // chains have a common node. Add it to the end of spineNodes.

    const postRoots = Sets.toArray(tree.roots);

    const rootObj = Object.create(null);
    const root = tree.createVertex(rootObj);

    postRoots.forEach(n => n.addParent(rootObj));

    spineNodes.push(root);



    // Loop through the spine nodes (except derived) in reverse order (ie. starting from
    // the root) and merge all the non-spine branches into single objects with null prototype.
    // Then copy the objects' properties to mixinPrototype (throwing an error on rewriting)
    // and check whether mixinPrototype is disjunct with the objects' sibling spine node.

    const mixinPrototype = Object.create(Object.getPrototypeOf(derived));

    // for each spine node except derived
    for (let i = spineNodes.length - 1; i > 0; i--)
    {
        // check whether mixinPrototype and this spine node are disjunct
        Object.getOwnPropertyNames(mixinPrototype).forEach(p =>
        {
            if (hasOwnProperty(spineNodes[i], p) && p !== 'constructor')
            {
                throw new IncompatiblePropertiesError(p);
            }
        });


        // for each sibling of spineNodes[i - 1]
        spineNodes[i].children.forEach(c =>
        {
            // skip spineNodes[i - 1] itself
            if (c === spineNodes[i - 1])
            {
                return;
            }
            
            // reduce c and its children into a single node
            mergeDerivedObjects(c);

            // copy c.key's properties to mixinPrototype and check for duplicity
            copyAllOwnProps(mixinPrototype, c.key, p =>
            {
                if (hasOwnProperty(mixinPrototype, p) && p !== 'constructor')
                {
                    throw new IncompatiblePropertiesError(p);
                }
            });
        });
    }

    
    // Now mixinPrototype is cool and good 👌
    return mixinPrototype;
}





/**
 * Change the prototype of `derivedCtor` to a mixin prototype which
 * inherits from `derivedCtor`'s prototype and contains all the properties
 * and methods from `baseCtors`.
 */

export function applyMixins(derivedCtor: Ctor, baseCtors: Ctor[]): void
{
    if (!Constructor.is(derivedCtor) || baseCtors.some(c => !Constructor.is(c)))
    {
        throw new TypeError('One of the arguments was not a constructor.');
    }

    let mixinSet: Set<Constructor.Prototype>; // derivedCtor's own mixins
    const currentMixins = derivedCtor.prototype[MixinSet]; // possibly mixins of a prototype

    // derivedCtor already is a mixin
    if (currentMixins instanceof Set)
    {

        // derivedCtor itself is a mixin
        if (hasOwnProperty(derivedCtor.prototype, MixinSet))
        {
            throw new TypeError(
                'The constructor passed to applyMixins already is a mixin and should be considered sealed.'
            );
        }

        // one of derivedCtor's parents is a mixin
        else
        {
            mixinSet = derivedCtor.prototype[MixinSet] = new Set(currentMixins);
        }
    }

    // derivedCtor is not yet a mixin
    else 
    {
        mixinSet = derivedCtor.prototype[MixinSet] = new Set();
    }



    // fetch all mixins
    baseCtors.forEach(_baseCtor =>
    {
        const baseCtor = _baseCtor as Constructor;

        // add this ctor to the list of mixins
        mixinSet.add(baseCtor.prototype);

        // is baseCtor a mixin?
        const baseMixins = baseCtor.prototype[MixinSet];
        if (baseMixins instanceof Set)
        {
            throw new TypeError('Mixins of mixins are not supported.');
        }
    });



    // create mixinPrototype and and set it as a prototype of derivedCtor.prototype
    const proto = produceMixinPrototype(derivedCtor.prototype, baseCtors.map(x => x.prototype));
    Object.setPrototypeOf(derivedCtor.prototype, proto);


    // 4. Profit
    return;
}
