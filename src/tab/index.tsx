import Tab from './Tab';
export default Tab;

export { default as Editor } from './Editor';
export { default as Preview } from './Preview';
export { default as References } from './ReferenceManager';
export { default as Equations } from './Equations';
export { default as DataManager } from './DataManager';

import {Editor, Preview, References, Equations, DataManager} from '.';
export const available: (typeof Tab)[] = [Editor, Preview, References, Equations, DataManager];