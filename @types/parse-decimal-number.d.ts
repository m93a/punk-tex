declare module 'parse-decimal-number'
{
    function parseDecimal(str: string, options?: string|{}, enforceGroupSize?: boolean): number;

    namespace parseDecimal
    {
        export function setOptions(newOptions: {}): void;
        export function factoryReset(): void;
        export function withOptions(options: {}, enforceGroupSize?: boolean): (str: string) => number;
    }

    export = parseDecimal;
}