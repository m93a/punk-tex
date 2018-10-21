import * as React from 'react';
import * as Class from './Class';

import * as REL from './React.EnumeratedLists';


export * from './React.EnumeratedLists';
export { default as LambdaCache } from './React.LambdaCache';


type ValidElement = React.ReactElement<{ children?: React.ReactNode }>;


export function isValidElement(el: any): el is ValidElement
{
    return React.isValidElement(el);
}

export function isHTMLElement(el: any): el is React.ReactHTMLElement<any>
{
    return isValidElement(el)
        && typeof el.type === 'string'
        && REL.listOfHTMLElementNames.indexOf(el.type as any) >= 0;
}

export function isElementOf<T extends Class.Ctor>(el: React.ReactChild, component: T):
    el is ValidElement & { type: T }
{
    return isValidElement(el)
            && typeof el.type === 'function'
            && Class.isSubclassOf(el.type, component);
}

export function isCommonHTMLAttribute(attr: any): attr is REL.CommonHtmlAttributeName
{
    return typeof attr === 'string' &&
           REL.listOfCommonHTMLAttributeNames.indexOf(attr as any) >= 0;
}

export function isHTMLAttribute(attr: any): attr is REL.HTMLAttributeName
{
    return typeof attr === 'string' &&
           REL.listOfHTMLAttributeNames.indexOf(attr as any) >= 0;
}

export function isEventAttribute(attr: any): attr is REL.EventAttributeName
{
    return typeof attr === 'string' &&
           REL.listOfEventAttributeNames.indexOf(attr as any) >= 0;
}







// General components and high-level functions

export class ClassedComponent<T extends ClassedComponent.Props>
extends React.Component<T>
{
    public static is(ch: any):
        ch is React.ReactElement<ClassedComponent.Props>
            & { type: () => any }
    {
        return isElementOf(ch, ClassedComponent);
    }

    public render()
    {
        return (
            <div className={this.props.className}>
                {this.props.children}
            </div>
        );
    }
}

export namespace ClassedComponent
{
    export interface Props
    {
        className?: string;
    }
}


const baseAddClassName =
function addClassName(
    element: React.ReactChild,
    className: string,
    wrapper?: (nonElement: any, className: string) => JSX.Element
): React.ReactElement<{ className?: string }>
{
    if (!wrapper)
    {
        wrapper = (el) => (<span className={className}>{el}</span>);
    }

    if (isHTMLElement(element) || ClassedComponent.is(element))
    {
        className += ' ' + (element.props.className || '');
        return React.cloneElement(element, { className });
    }
    else
    {
        return wrapper(element, className);
    }

};

export {baseAddClassName as addClassName};



export namespace Children
{
    export const map = React.Children.map;
    export const forEach = React.Children.forEach;
    export const count = React.Children.count;
    export const only = React.Children.only;
    export const toArray = React.Children.toArray;

    export function addClassName
    (
        children: React.ReactNode,
        className: string,
        wrapper?: (nonElement: any, className: string) => JSX.Element
    )
    : React.ReactElement<{ className?: string }>[]
    {
        return Children.map( children, (ch) => baseAddClassName(ch, className) );
    }

    export function some
    (
        children: React.ReactNode,
        fn: (child: React.ReactChild, index: number) => boolean
    )
    : boolean
    {
        let result = false;
        Children.forEach(children, (ch, i) =>
        {
            if (!result)
            {
                result = fn(ch, i);
            }
        });

        return result;
    }
}



export namespace Descendants
{

    export function forEach
    (
        children: React.ReactNode,
        fn: (child: React.ReactChild, index: number) => void
    )
    : void
    {
        let index = 0;

        function loop(descendants: React.ReactNode)
        {
            React.Children.forEach(descendants, (child) => {
                fn(child, index++);
                if (isValidElement(child))
                {
                    loop(child.props.children);
                }
            });
        }

        loop(children);
    }



    /** Flattens the array of all descendants and maps all its elements */

    export function flatMap<T>
    (
        children: React.ReactNode,
        fn: (child: React.ReactChild, index: number) => T
    )
    : T[]
    {
        const arr: T[] = [];
        Descendants.forEach(children, (ch, i) => arr.push(fn(ch, i)));
        return arr;
    }



    /** Map all the descendants while keeping the tree's structure */

    export function deepMap
    (
        children: React.ReactNode,
        fn: (child: React.ReactChild) => React.ReactNode
    )
    : React.ReactNode
    {
        function loop
        (
            descendants: React.ReactNode
        )
        : {} | null
        {
            let descendantsModified = false;
            const modifiedDescendants = Object.create(null);

            React.Children.forEach(descendants, (child, index) =>
            {
                const newChild = fn(child);

                if (newChild !== child)
                {
                    descendantsModified = true;
                    modifiedDescendants[index] = newChild;
                }

                if (isValidElement(newChild))
                {
                    const modifiedSubLoop =
                    loop(newChild.props.children);

                    if (modifiedSubLoop)
                    {
                        descendantsModified = true;

                        const oldDescendants =
                        React.Children.toArray(newChild.props.children);

                        const newDescendants =
                        Object.assign(oldDescendants, modifiedSubLoop);

                        modifiedDescendants[index] =
                        React.cloneElement(newChild, {children: newDescendants} as {children?: React.ReactNode});
                    }
                }
            });

            return descendantsModified ? modifiedDescendants : null;
        }

        const modifiedChildren =
        loop(children);

        if (modifiedChildren)
        {
            const oldChildren =
            React.Children.toArray(children);

            const newChildren =
            Object.assign(oldChildren, modifiedChildren);

            return newChildren;
        }

        return children;
    }

    export function count(children: React.ReactNode): number
    {
        let i = 0;
        Descendants.forEach(children, () => i++);
        return i;
    }

    export function only(children: React.ReactNode): React.ReactElement<any>
    {
        const child = React.Children.only(children);
        if (child.props.children) { React.Children.only(undefined); }
        return child;
    }

    export function toArray(children: React.ReactNode): React.ReactChild[]
    {
        const arr: React.ReactChild[] = [];
        Descendants.forEach(children, (ch) => arr.push(ch));
        return arr;
    }

    export function some(children: React.ReactNode, fn: (child: React.ReactChild, index: number) => boolean): boolean
    {
        let result = false;
        Descendants.forEach(children, (ch, i) =>
        {
            if (!result)
            {
                result = fn(ch, i);
            }
        });

        return result;
    }
}