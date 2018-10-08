
namespace IterableHelpers
{

    /** Polyfill for the for(of) cycle that only works for arrays when targeting ES6. */

    export function forOf<T>(
        iterable: Iterable<T>,
        fn: (
            item: T,
            control: {
                Continue: forOf.Control.Continue,
                Break: forOf.Control.Break
            }
        ) => (forOf.Control | undefined)
    )
    : void
    {
        const iterator = iterable[Symbol.iterator]();
        let next = iterator.next();
        while (!next.done)
        {
            const control = fn(next.value, forOf.Control);
    
            if (control === forOf.Control.Break)
            {
                break;
            }
    
            next = iterator.next();
        }
    }
    
    export namespace forOf
    {
        /**
         * Return this enum from your callback function to control the loop –
         * provides similar functionality to the `continue` and `break` keywords.
         */
        export enum Control
        {
            Continue,
            Break
        }
    }
    


    /**
     * Returns a new `Iterable` containing only those elements whose callback output was `true`.
     * The callback is called with the lazy evaluation strategy.
     */

    export function* filter<T>(
        iterable: Iterable<T>,
        fn: (item: T) => boolean
    )
    : Iterable<T>
    {
        const iterator = iterable[Symbol.iterator]();
        let next = iterator.next();
        while (!next.done)
        {
            if (fn(next.value))
            {
                yield next.value;
            }
    
            next = iterator.next();
        }
    }



    /** Appends a value to the end of the sequence. */

    export function* append<T>(
        iterable: Iterable<T>,
        element: T
    )
    : Iterable<T>
    {
        const iterator = iterable[Symbol.iterator]();
        let next = iterator.next();

        while (!next.done)
        {
            yield next.value;
            next = iterator.next();
        }

        yield element;
    }



    /** Adds a value to the beginning of the sequence. */

    export function* prepend<T>(
        iterable: Iterable<T>,
        element: T
    )
    : Iterable<T>
    {
        const iterator = iterable[Symbol.iterator]();
        let next = iterator.next();

        yield element;

        while (!next.done)
        {
            yield next.value;
            next = iterator.next();
        }
    }



    /** Returns a new `Iterable` that is a concatenation of the arguments. */

    export function* concat<T>(
        first: Iterable<T>,
        second: Iterable<T>,
        ...rest: Iterable<T>[]
    )
    : Iterable<T>
    {
        rest.unshift(first, second);

        for (const el of rest)
        {
            const iterator = el[Symbol.iterator]();
            let next = iterator.next();

            while (!next.done)
            {
                yield next.value;
                next = iterator.next();
            }
        }

    }



    /** Returns `true` once the callback returns `true` for the first time, otherwise returns `false`. */

    export function some<T>(
        iterable: Iterable<T>,
        fn: (item: T) => boolean
    )
    : boolean
    {
        const iterator = iterable[Symbol.iterator]();
        let next = iterator.next();
        while (!next.done)
        {
            if (fn(next.value))
            {
                return true;
            }
    
            next = iterator.next();
        }

        return false;
    }



    /** Returns `false` once the callback returns `false` for the first time, otherwise returns `true`. */

    export function every<T>(
        iterable: Iterable<T>,
        fn: (item: T) => boolean
    )
    : boolean
    {
        return !some( iterable, x => !fn(x) );
    }



    /** 
     * Returns a new `Iterable` with each element replaced by its callback output.
     * The callback is called with the lazy evaluation strategy.
     */

    export function* map<T, S>(
        iterable: Iterable<T>,
        fn: (item: T) => S
    )
    : Iterable<S>
    {
        const iterator = iterable[Symbol.iterator]();
        let next = iterator.next();
        while (!next.done)
        {
            yield fn(next.value);
            next = iterator.next();
        }
    
        next = iterator.next();
    }



    /**
     * Pushes all elements of the iterable into a new array and returns it.
     */    
    export function toArray<T>(
        iterable: Iterable<T>
    )
    : T[]
    {
        const arr: T[] = [];
        forOf(iterable, el => arr.push(el));
        return arr;
    }
}


export default IterableHelpers;