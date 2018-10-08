
namespace SetHelpers
{
    /** Returns a new `Set` that contains the entries from all of the arguments. */
    export function union<T>(A: Set<T>, B: Set<T>, ...more: Set<T>[]): Set<T>
    {
        const uni = new Set<T>();
        more.push(A, B);

        more.forEach(set =>
            set.forEach( item => uni.add(item) )
        );

        return uni;
    }

    /** Returns a new `Set` containing the entries that are present in each argument. */
    export function intersection<T>(A: Set<T>, B: Set<T>, ...more: Set<T>[]): Set<T>
    {
        const result = new Set<T>();
        more.push(B);

        A.forEach(item =>
        {
            if ( !more.some(s => !s.has(item)) )
            {
                result.add(item);
            }
        });

        return result;
    }

    /** Returns a new `Set` whose elements are in `A` but not in `B`. */
    export function difference<T>(A: Set<T>, B: Set<T>): Set<T>
    {
        const result = new Set<T>();

        A.forEach(item =>
        {
            if (!B.has(item))
            {
                result.add(item);
            }
        });

        return result;
    }

    /** Returns a new array containing all elements of the Set. Order is undefined. */
    export function toArray<T>(set: Set<T>): T[]
    {
        const arr = [] as T[];

        set.forEach(x => arr.push(x));

        return arr;
    }
}

export default SetHelpers;
