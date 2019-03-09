import * as Zip from 'jszip';
import Project from './project';
import { saveAs as saveFunc } from 'file-saver';


namespace FileSystem
{
    export async function archive(project: Project): Promise<Blob> {
        const zip = new Zip();
        zip.file("content", project.content);
        return await zip.generateAsync({type: "blob"});
    }

    export const saveAs = saveFunc;
}
export default FileSystem;