import {Data} from '../tabs/DataManager';
import sq from './sampleQuantities';
import se from './sampleEquations';

export default () => {
    const sampleTables = new Map<string, Data>();
    const sampleQuantities = sq();
    const sampleEquations = se();

    sampleTables.set(
        'rcMeasurements',
        {
            id: 'rcMeasurements',
            name: 'Měření R&C',
            columns: [
                { quantity: sampleQuantities.get('resistance')!, values: [1, 2, 3], equation: null },
                { quantity: sampleQuantities.get('capacity')!,   values: [4, 5, 6], equation: null },
                { quantity: sampleQuantities.get('timeCoeff')!, values: [], equation: sampleEquations.get('tau')!}
            ]
        }
    );

    return sampleTables;
};