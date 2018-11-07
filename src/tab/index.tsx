import Tab from './Tab';
export default Tab;

export { default as Editor } from './Editor';
export { default as Preview } from './Preview';
export { default as References } from './References';
export { default as Equations } from './Equations';
export { default as DataManager } from './DataManager';

export { default as ReferencePreview } from './ReferencePreview';

import {Editor, Preview, References, Equations, DataManager, ReferencePreview} from '.';
export const available: (typeof Tab)[] = [Editor, Preview, References, Equations, DataManager, ReferencePreview];