import * as React from 'react';
import * as MD from 'markdown-it';
import * as RH from '../react-helpers';

import { hasOwnProperty as hasProp, callOrNot } from '../react-helpers';

export function isToken(token: any): token is MD.Token
{
    if (
        hasProp(token, 'nesting')   && typeof token.nesting === 'number' &&
        hasProp(token, 'tag')       && typeof token.tag === 'string' &&
        hasProp(token, 'type')      && typeof token.type === 'string' &&

        'attrGet'   in token && typeof token.attrGet === 'function' &&
        'attrIndex' in token && typeof token.attrIndex === 'function' &&
        'attrJoin'  in token && typeof token.attrJoin === 'function' &&
        'attrPush'  in token && typeof token.attrPush === 'function' &&
        'attrSet'   in token && typeof token.attrSet === 'function' &&

        hasProp(token, 'attrs')     && (Array.isArray(token.attrs) || token.attrs === null) &&
        hasProp(token, 'block')     && typeof token.block === 'boolean' &&
        hasProp(token, 'children')  && (Array.isArray(token.children) || token.children === null) &&
        hasProp(token, 'content')   && typeof token.content === 'string' &&
        hasProp(token, 'hidden')    && typeof token.hidden === 'boolean' &&
        hasProp(token, 'info')      && typeof token.info === 'string' &&
        hasProp(token, 'level')     && typeof token.level === 'number' &&
        hasProp(token, 'map')       && (Array.isArray(token.map) || token.map === null) &&
        hasProp(token, 'markup')    && typeof token.markup === 'string' &&
        hasProp(token, 'meta')
    )
    return true;

    else return false;
}

export function renderAsInlineToken(state: MD.StateInline, node: React.ReactNode)
{
    if (typeof node === 'undefined' || typeof node === 'boolean' || node === null)
    {
        return;
    }

    if (typeof node === 'string' || typeof node === 'number')
    {
        const token = state.push('text', '', 0);
        token.content = String(node);
        return;
    }

    if (Array.isArray(node))
    {
        for (const n of node) renderAsInlineToken(state, n);
        return;
    }

    if (isToken(node))
    {
        const token = state.push(node.type, node.tag, node.nesting);
        Object.assign(token, node);
        return;
    }

    if (RH.isValidElement(node))
    {
        if (RH.isHTMLElement(node))
        {
            const children = node.props.children;

            let token: MD.Token;

            if (typeof children === 'undefined' || typeof children === 'boolean' || children === null)
            {
                token = state.push(node.type, node.type, 0);
            }
            else
            {
                token = state.push(node.type + '_open', node.type, 1);
                renderAsInlineToken(state, children);
                state.push(node.type + '_close', node.type, -1);
            }

            for (const key of Object.keys(node.props))
            {
                if (key === 'dangerouslySetInnerHTML')
                {
                    throw Error('Property dangerouslySetInnerHTML has not been implemented yet');
                }
                else if (key === 'className')
                {
                    token.attrSet('class', String(node.props.className));
                }
                else if (RH.isHTMLAttribute(key))
                {
                    token.attrSet(key, String(node.props[key]));
                }
                else if (RH.isEventAttribute(key))
                {
                    throw Error('Event attributes are not supported.')
                }
            }

            return;

        }
        else if (RH.isElementOf(node, React.Component))
        {
            const component = new node.type(node.props);
            callOrNot(component.componentWillMount);
            callOrNot(component.componentDidMount);

            renderAsInlineToken(state, component.render());

            callOrNot(component.componentWillUnmount);
            return;
        }
    }

    console.error('Object was not recognized as a valid React child: ', node);
    throw new TypeError("Object is not valid as a React child.");
}