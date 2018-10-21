import Iterable from './Iterable';
import { stripIndent } from 'common-tags';


/*

# How enums work in TypeScript
Const enums always get inlined so there's nothing interesting to do with them
Ordinary enums generate an object where the property names represent enum keys
and the property values represent enum values.

enum Foo      → const Foo =
{             → {
  Bar = 'a'   →   "Bar": 'a'
}             → }


Numeric names for enum keys are disallowed.

enum Foo
{
    ["10"] = 'a'    → Error: An enum member cannot have a numeric name.
}


If you use numbers as enum values, they will get a corresponding property key
pointing to the values' key.

enum Foo      → const Foo =
{             → {
  Bar = 5     →   "Bar": 5,
              →   "5": "Bar"
}             → }


Leaving out explicit values means the compiler fills them with integers starting at 0.

enum Foo    → enum Foo
{           → {
  A,        →   A = 0,
  B,        →   B = 1,
  C         →   C = 2
}           → }

This however means that some values of Foo evaluate to false, which is discouraged.
Therefore it's recommended to start the enum manually with 1 and then let the compiler
auto-increment the rest.

*/





// Helper function for devs

function getValueRepresentation(value: any): string
{
    switch (typeof value)
    {
        case 'string':
            return JSON.stringify(value).slice(1, -1);

        case 'number':
        case 'boolean':
        case 'symbol':
            return value.toString();

        case 'undefined':
            return 'undefined';

        default:
            if (value === null)
            {
                return 'null';
            }

            if (typeof value.toString === 'function')
            {
                return value.toString();
            }

            return Object.toString.call(value);

    }
}


const KeySet = Symbol('EnumKeys');
const ReverseMap = Symbol('EnumReverseMap');

interface FinalizedEnum<T>
{
    [KeySet]: Set<keyof T>;
    [ReverseMap]: Map<string|number, keyof T>;
};

namespace Enum
{

    /**
     * Call this function after the declaration of an enum and
     * before declaration merging to keep track of enum's keys and values.
     * Throws a TypeError if any of the enum's values evaluates to false
     * or if two keys define the same value.
     */
    export function finalize(enumObject: object): void
    {
        softFinalize(enumObject);
        assertIsTruthy(enumObject);
        assertIsBijection(enumObject);
    }

    /**
     * Finalizes an enum but doesn't perform checks for truthines
     * and involution property.
     */
    export function softFinalize(enumObject: object): void
    {
        if (isFinalized(enumObject))
        {
            throw new TypeError('This enum has already been finalized.');
        }

        const keys = new Set<string>();
        const map = new Map<string|number, string>();

        for (const key of Object.getOwnPropertyNames(enumObject))
        {
            // Skip numeric property names
            if (+key + '' !== key)
            {
                keys.add(key);
                map.set(enumObject[key], key);
            }
        }
        enumObject[KeySet] = keys;
        enumObject[ReverseMap] = map;
    }

    /** Checks whether Enum.finalize has been called on the enum. */
    export function isFinalized<T>(enumObject: T|object): enumObject is FinalizedEnum<T>
    {
        return (
            enumObject[KeySet] instanceof Set &&
            enumObject[ReverseMap] instanceof Map
        );
    }



    // Asserts

    /** Checks whether Enum.finalize has been called on the enum, else throws a TypeError. */
    export function assertIsFinalized(enumObject: object): void
    {
        if (!isFinalized(enumObject))
        {
            throw new TypeError('This enum is required to be finalized.');
        }
    }

    /**
     * Checks whether two enums don't share any value and
     * throws a TypeError if they do.
     */
    export function assertAreDisjunct(enumA: object, enumB: object): void
    {
        const valuesA = Enum.valuesOf(enumA);
        for (const value of valuesA)
        {
            if (Enum.isValueOf(value, enumB))
            {
                throw new TypeError(
                    stripIndent`
                        The enums were expected to be disjunct while they share
                        the same value: ${getValueRepresentation(value)}
                    `
                );
            }
        }
    }


    /**
     * Checks whether all values of an finalized enum evaluate to true.
     */
    export function assertIsTruthy(enumObject: object): void
    {
        if (valuesOf(enumObject).some(x => !x))
        {
            throw new TypeError(
                `The enum was expected to be truthy but contained a value that evaluate to false.`
            );
        }
    }


    /**
     * Checks whether every value of the enum maps back to its key.
     * Call this function *right after* the delcaration of enum
     * and before any declaration merging!
     */
    function assertIsBijection(enumObject: object): void
    {
        if (!Enum.isBijection(enumObject))
        {
            throw new TypeError(
                stripIndent`
                    The enum was expected to be an involution but
                    a value was found that doesn't map back to its key.
                `
            );
        }
    }


    // Util functions

    /**
     * Checks whether a value is present in a finalized enum.
     * This will most likely return true even for keys because of
     * the way TypeScript implements enums.
     */
    export function isValueOf(value: any, enumObject: object): boolean
    {
        if (!isFinalized(enumObject))
        {
            throw assertIsFinalized(enumObject);
        }

        let containsValue = false;

        Iterable.forOf(enumObject[KeySet], (key, ctrl) =>
        {
            if (enumObject[key] === value)
            {
                containsValue = true;
                return ctrl.Break;
            }
            return ctrl.Continue;
        });

        return containsValue;
    }

    export function keysOf<T extends object>(enumObject: T): (keyof T)[]
    {
        if (!isFinalized(enumObject))
        {
            throw assertIsFinalized(enumObject);
        }

        return Iterable.toArray(enumObject[KeySet]) as (keyof T)[];
    }

    /**
     * Returns an array with all the values contained by a finalized enum.
     */
    export function valuesOf(enumObject: object): (string|number)[]
    {
        if (!isFinalized(enumObject))
        {
            throw assertIsFinalized(enumObject);
        }

        return Iterable.toArray(
            Iterable.map(enumObject[KeySet], n => enumObject[n])
        );
    }

    /**
     * Checks whether the two enums don't define keys with the same value.
     */
    export function areDisjunct(enumA: object, enumB: object): boolean
    {
        return valuesOf(enumA).some(v => isValueOf(v, enumB));
    }

    /**
     * Checks whether each value only has one key.
     */
    export function isBijection(enumObject: object): boolean
    {
        if (!isFinalized(enumObject))
        {
            throw assertIsFinalized(enumObject);
        }

        return enumObject[KeySet].size === enumObject[ReverseMap].size;
    }
}

export default Enum;