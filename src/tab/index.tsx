import Tab from './Tab';
export default Tab;

export { default as Editor } from './Editor';
export { default as Preview } from './Preview';
export { default as References } from './References';
export { default as EquationManager } from './Equations';
export { default as DataManager } from './DataManager';

export { default as ReferencePreview } from './ReferencePreview';

import {Editor, Preview, References, EquationManager, DataManager, ReferencePreview} from '.';
export const available: (typeof Tab)[] = [Editor, Preview, References, EquationManager, DataManager, ReferencePreview];