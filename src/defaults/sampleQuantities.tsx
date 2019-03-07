import {Quantity} from '../tabs/Quantities';

const sampleQuantities = new Map<string, Quantity>();

sampleQuantities.set('timeCoeff', {id: 'timeCoeff', name: 'Časový koeficient', tex: '\\tau'});
sampleQuantities.set('resistance', {id: 'resistance', name: 'Odpor', tex: 'R'});
sampleQuantities.set('capacity', {id: 'capacitance', name: 'Kapacita', tex: 'C'});

export default sampleQuantities;