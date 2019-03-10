import {Data} from '../tabs/DataManager';
import sq from './sampleQuantities';

export default () => {
    const sampleTables = new Map<string, Data>();
    const sampleQuantities = sq();

    sampleTables.set(
        'rcMeasurements',
        {
            id: 'rcMeasurements',
            name: 'Měření R&C',
            columns: [
                { quantity: sampleQuantities.get('resistance')!, values: [1, 2, 3] },
                { quantity: sampleQuantities.get('capacity')!,   values: [4, 5, 6] }
            ]
        }
    );

    return sampleTables;
};