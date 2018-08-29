declare module 'texzilla'
{
    export default class TeXZilla
    {
        static setDOMParser(...args: any[]): any;
        static setXMLSerializer(...args: any[]): any;
        static setSafeMode(...args: any[]): any;
        static setItexIdentifierMode(...args: any[]): any;
        static getTeXSource(...args: any[]): any;
        static toMathMLString(...args: any[]): any;
        static toMathML(...args: any[]): any;
        static toImage(...args: any[]): any;
        static filterString(...args: any[]): any;
        static filterElement(...args: any[]): any;
    }
}