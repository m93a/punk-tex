import * as Zip from 'jszip';
import Project from './project';
import { saveAs as saveFunc } from 'file-saver';
import * as _ from 'lodash';
import { Quantity } from './tabs/Quantities';
import { SerializedEquation } from './tabs/Equations';


namespace FileSystem
{
    export async function archive(project: Project): Promise<Blob> {
        const zip = new Zip();

        zip.file('content',    project.content);
        zip.file('references', stringifyMap(project.references));
        zip.file('equations',  stringifyMap(project.equations));
        zip.file('quantities', stringifyMap(project.quantities));
        zip.file('tables',     stringifyMap(project.tables));

        return await zip.generateAsync({ type: 'blob' });
    }

    export async function loadProject(data: Blob): Promise<Project> {
        const project = new Project(false);
        const zip = await Zip.loadAsync(data);

        project.content    = await zip.file('content').async('text');
        project.references = await readMap(await zip.file('references').async('text'));
        project.equations  = await readMap(await zip.file('equations').async('text'), SerializedEquation);
        project.quantities = await readMap(await zip.file('quantities').async('text'), Quantity);
        project.tables     = await readMap(await zip.file('tables').async('text'));

        return project;
    }

    export async function stringifyMap<K, V>(map: Map<K, V>): Promise<Blob> {
        const obj = {} as { [key: string]: V };
        map.forEach((v, k) => obj[k.toString()] = v)
        return new Blob([JSON.stringify(obj)], { type: 'application/json' });
    }

    // tslint:disable-next-line:callable-types
    export async function readMap<V>(data: string, constructor?: { new(): V }): Promise<Map<string, V>> {
        const map = new Map<string, V>();
        const obj = JSON.parse(data);

        Object.keys(obj).forEach(k => {
            let v: V;
            if (constructor) {
                v = new constructor();
                _.assign(v, obj[k]);
            } else {
                v = obj[k] as V;
            }
            map.set(k, v);
        });

        return map;
    }

    export const saveAs = saveFunc;
}
export default FileSystem;