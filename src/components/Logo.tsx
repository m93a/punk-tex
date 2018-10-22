import * as React from 'react';

export default function(props: any) {
    return (
        <span {...props}>
            <span className="punkTeX-punk">
                <span className="punkTeX-p">p</span>
                <span className="punkTeX-u">u</span>
                <span className="punkTeX-n">n</span>
                <span className="punkTeX-k">k</span>
            </span>
            <span className="TeX">T<span className="TeX-e">E</span>X</span>
        </span>
    );
}