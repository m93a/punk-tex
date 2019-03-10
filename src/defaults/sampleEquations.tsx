import {SerializedEquation} from '../tabs/Equations';

export default () => {
    const sampleEqns = new Map<string, SerializedEquation>();
    sampleEqns.set('tau', { id: 'tau', lhs: 'timeCoeff', rhs: 'resistance capacity'});
    return sampleEqns;
};