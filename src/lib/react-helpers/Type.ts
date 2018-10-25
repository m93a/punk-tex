
export type Required_ish<T> =
{
    [K in keyof Required<T>]: T[K]
};