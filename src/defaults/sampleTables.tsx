import {Data} from '../tabs/DataManager';
import sampleQuantities from './sampleQuantities';

const sampleTables = new Map<string, Data>();

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

export default sampleTables;