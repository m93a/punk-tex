
namespace IterableHelpers
{

    /**
     * Polyfill for the for(of) cycle that only works for arrays when targeting ES6.
     * @param iterable - finite series
     */

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
     * Compare two iterables and return true if they contain equal elements.
     * The first two parameters may be infinite series only if you can guarantee
     * they're different, otherwise they have to be finite.
     *
     * @param compare - custom comparer that recieves two items as arguments and
     * returns `true` for equality and `false` for inequality
     */
    export function areEqual<T, U>(
        iter1: Iterable<T>,
        iter2: Iterable<U>,
        compare?: (a: T, b:  U) => boolean
    )
    : boolean
    {
        const i1 = iter1[Symbol.iterator]();
        const i2 = iter2[Symbol.iterator]();
        let next1 = i1.next();
        let next2 = i2.next();

        if (compare)
        {
            while (!next1.done && !next2.done)
            {
                if (!compare(next1.value, next2.value)) return false;
                next1 = i1.next();
                next2 = i2.next();
            }
        }
        else
        {
            while (!next1.done && !next2.done)
            {
                if (next1.value !== next2.value as any) return false;
                next1 = i1.next();
                next2 = i2.next();
            }
        }

        return next1.done === next2.done;
    }



    /**
     * Returns a new `Iterable` containing only those elements whose callback output was `true`.
     * The callback is called with the lazy evaluation strategy.
     * @param iterable - possibly infinite series
     */

    export function* filter<T>(
        iterable: Iterable<T>,
        fn: (item: T, index: number) => boolean
    )
    : Iterable<T>
    {
        const iterator = iterable[Symbol.iterator]();
        let next = iterator.next();
        let i = 0;
        while (!next.done)
        {
            if (fn(next.value, i++))
            {
                yield next.value;
            }

            next = iterator.next();
        }
    }



    /**
     * Appends a value to the end of the sequence.
     * @param iterable - possibly infinite series
     */

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



    /**
     * Adds a value to the beginning of the sequence.
     * @param iterable - possibly infinite series
     */

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



    /**
     * Only iterates through the first `count` items.
     * @param iterable - possibly infinite series
     */

    export function* first<T>(
        iterable: Iterable<T>,
        count: number
    )
    : Iterable<T>
    {
        if (count < 1) return;

        const iterator = iterable[Symbol.iterator]();
        let next = iterator.next();
        let i = 0;

        while (i < count && !next.done)
        {
            yield next.value;
            next = iterator.next();
            i++;
        }
    }



    /**
     * Skips `count` items starting at `start` (0 by default)
     * @param skip - possibly infinite series
     */

    export function* skip<T>(
        iterable: Iterable<T>,
        count: number,
        start?: number
    )
    : Iterable<T>
    {
        start = start || 0;
        if (start < 0) count += start;
        if (count < 1) return;

        const iterator = iterable[Symbol.iterator]();
        let next = iterator.next();
        let i = 0;

        while (i < start && !next.done)
        {
            yield next.value;
            next = iterator.next();
            i++;
        }

        while (i < start + count && !next.done)
        {
            next = iterator.next();
            i++;
        }

        while (!next.done)
        {
            yield next.value;
            next = iterator.next();
        }
    }



    /**
     * Iterates through the whole sequence and then returns the last `count` items.
     * @param iterable - finite series
     */

    export function* last<T>(
        iterable: Iterable<T>,
        count: number
    )
    : Iterable<T>
    {
        if (count < 1) return;

        const arr = Array(count);

        const iterator = iterable[Symbol.iterator]();
        let next = iterator.next();
        let i = 0;

        while (!next.done)
        {
            arr.shift();
            arr.push(next.value);
            next = iterator.next();
            i++;
        }

        if (i < count) return arr.slice(count - i, count);

        yield* arr;
    }



    /**
     * Returns a new `Iterable` that is a concatenation of the arguments.
     * All the arguments can possibly be infinite iterables.
     */

    export function* concat<T>(
        iter1: Iterable<T>,
        iter2: Iterable<T>,
        ...rest: Iterable<T>[]
    )
    : Iterable<T>
    {
        rest.unshift(iter1, iter2);

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



    /**
     * Returns `true` once the callback returns `true` for the first time, otherwise returns `false`.
     * @param iterable - finite series (it can be infinite if you can guarantee it at least once evaluates to `true`)
     */

    export function some<T>(
        iterable: Iterable<T>,
        fn: (item: T, index: number) => boolean
    )
    : boolean
    {
        const iterator = iterable[Symbol.iterator]();
        let next = iterator.next();
        let i = 0;
        while (!next.done)
        {
            if (fn(next.value, i++))
            {
                return true;
            }

            next = iterator.next();
        }

        return false;
    }



    /**
     * Returns `false` once the callback returns `false` for the first time, otherwise returns `true`.
     * @param iterable - finite series (it can be infinite if you can guarantee it at least once evaluates to `false`)
     */

    export function every<T>(
        iterable: Iterable<T>,
        fn: (item: T, index: number) => boolean
    )
    : boolean
    {
        return !some( iterable, (x,i) => !fn(x,i) );
    }



    /**
     * Returns a new `Iterable` with each element replaced by its callback output.
     * The callback is called with the lazy evaluation strategy.
     * @param iterable - possibly infinite series
     */

    export function* map<T, S>(
        iterable: Iterable<T>,
        fn: (item: T, index: number) => S
    )
    : Iterable<S>
    {
        const iterator = iterable[Symbol.iterator]();
        let next = iterator.next();
        let i = 0;
        while (!next.done)
        {
            yield fn(next.value, i++);
            next = iterator.next();
        }

        next = iterator.next();
    }



    /**
     * Returns an `Iterable` that contains all permutations of the argument (which are also iterables).
     * The first yielded permutations are those that are different at the beginning of the series and
     * the rest stays unchanged. Lazy evaluation is used. Note that you can pass an infinite iterable
     * as the argument, but the result would be an infinite iterable of infinite iterables.
     *
     * @param iterable - possibly infinite series
     */
    export function* permutations<T>(
        iterable: Iterable<T>,
        recursionLevel: number = 0
    ): Iterable<Iterable<T>>
    {
        yield iterable;

        const elements: T[] = [];

        const iterator = iterable[Symbol.iterator]();
        let next = iterator.next();
        while (!next.done)
        {
            const pmts = permutations(elements, recursionLevel+1)[Symbol.iterator]();

            let pmt = pmts.next();
            const l = elements.length;

            while (!pmt.done)
            {
                // iterable can't be reused, turn it into an array
                const pmtArr = Array.from(pmt.value);

                for (let i = l-1; i >= 0; i--)
                {
                    const pmtCopy = Array.from(pmtArr);
                    pmtCopy.splice(i, 0, next.value);

                    yield (function* () {
                        yield* pmtCopy;

                        // yield* skip(iterable, l+1) but downleveled
                        const xIter = skip(iterable, l+1)[Symbol.iterator]();
                        let xNext = xIter.next();
                        while (!xNext.done)
                        {
                            yield xNext.value;
                            xNext = xIter.next();
                        }
                    })()
                }
                pmt = pmts.next();
            }

            elements.push(next.value)
            next = iterator.next();
        }
    }



    /**
     * Pushes all elements of the iterable into a new array and returns it.
     * @param iterable - finite series
     */
    export function toArray<T>(
        iterable: Iterable<T>
    )
    : T[]
    {
        return Array.from(iterable);
    }
}


// When you import the helpers as Iterable
type IterableHelpers<T> = Iterable<T>;

export default IterableHelpers;