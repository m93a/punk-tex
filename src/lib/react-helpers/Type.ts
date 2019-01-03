
/**
 * Make all properties in T required, but keep undefined in their type
 */
export type Explicit<T> =
{
    [K in keyof Required<T>]: T[K]
};

/**
 * Make all properties that contain undefined in their type optional
 */
export type Implicit<T> = { [K in keyof _Implicit<T>]: _Implicit<T>[K] };
type _Implicit<T> =
{
    [K in DefinedKnownKeys<T> & keyof T]: T[K]
}
&
{
    [K in UndefinedKnownKeys<T> & keyof T]?: T[K]
}
&
{
    [K in IndexSignatureKeys<T> & keyof T]
        : string extends K ? T[K]
        : number extends K ? T[K]
        : never
};



/**
 * Remove undefined from the type of all properties
 */
export type Defined<T> =
{
    [K in keyof T]: Exclude<T[K], undefined>;
};

/**
 * Make all properties possibly undefined, but keep their requiredness
 */
export type Undefined<T> =
{
    [K in keyof T]: T[K] | undefined
};

/**
 * Make all properties in T required and remove undefined from their types
 */
export type RequiredDefined<T> = Defined<Required<T>>;



/**
 * Turn type union into type intersection
 */
export type UnionToIntersection<U> =
    (U extends any
        ? (k: U) => void
        : never
    ) extends (
        (k: infer I) => void
    )
    ? I : never;



/**
 * Similar to `keyof T` but excludes index signatures
 */
export type KnownKeys<T> = {
    // Mapped type but remove keys that are string, number or wider
    // (ie. remove index signatures, so we're only left with actual key names).
    // Save the computed type as a property of the mapped type.
    [K in keyof T]: string extends K ? never : number extends K ? never : K
} extends {
    // retrieve the computed type as U
    [_ in keyof T]: infer U
} ? U : never;


/**
 * All keys that correspond to required properties of T, excluding index signatures
 */
export type RequiredKnownKeys<T> =
{
    // {} extends A is true only if all properties of A are optional.
    // Foreach through all keys in T and if they correspond to a required
    // property, save them as a property of the mapped type.
    [K in keyof T]: {} extends Pick<T, K> ? never : K
} extends {
    // retrieve the computed type as U
    [_ in keyof T]: infer U
} ? U : never;


/**
 * All keys that correspond to optional properties of T, excluding index signatures
 */
export type OptionalKnownKeys<T> =
{
    // remove index signatures and required keys and save as property type
    [K in keyof T]: string extends K ? never
                  : number extends K ? never
                  : {} extends Pick<T, K> ? K
                  : never
} extends {
    // retrieve the computed type as U
    [_ in keyof T]: infer U
} ? U : never;


/**
 * All keys that correspond to properties of T which cannot be undefined, excluding index signatures
 */
export type DefinedKnownKeys<T> =
{
    // remove index signatures and undefined keys and save as property type
    [K in keyof T]: string extends K ? never
                  : number extends K ? never
                  : undefined extends T[K] ? never
                  : K
} extends {
    // retrieve the computed type as U
    [_ in keyof T]: infer U
} ? U : never;


/**
 * All keys that correspond to properties of T which can be undefined, excluding index signatures
 */
export type UndefinedKnownKeys<T> =
{
    // remove index signatures and undefined keys and save as property type
    [K in keyof T]: string extends K ? never
                  : number extends K ? never
                  : undefined extends T[K] ? K
                  : never
} extends {
    // retrieve the computed type as U
    [_ in keyof T]: infer U
} ? U : never;


/**
 * `string` if T has index signature which takes string,
 * `number` if T has index singature which takes number,
 * `never` otherwise
 */
export type IndexSignatureKeys<T> =
    string extends keyof T ? string
    : number extends keyof T ? number
    : never;





/*
interface Foo
{
    a: number;
    b: number | undefined;
    c?: number;
    d?: number | undefined;

    [k: string]: number | undefined;
}

type X = {[K in keyof Foo]: Foo[K]}

type A = RequiredDefined<Foo>;
type B = Required<Foo>;
type C = Defined<Foo>;
type D = Explicit<Foo>;
type E = Implicit<Foo>;
type F = Undefined<Foo>;
type G = Partial<Foo>;

type K = keyof Foo;
type L = KnownKeys<Foo>;
type M = RequiredKnownKeys<Foo>;
type N = OptionalKnownKeys<Foo>;
//*/
