import { toMathMLString } from 'texzilla';

export default function LaTeXtoMathML(tex: string, block?: boolean)
{
    return toMathMLString(tex, block)
            .replace(
                '<mo stretchy="false">~</mo>',
                '<mspace linebreak="nobreak" width="mediummathspace"/>'
            )
}