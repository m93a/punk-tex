/**
 * Array designed for holding and releasing large chunks of data.
 * Its design makes dropping unused data faster and more reliable
 * (as it's easier for the GC to detect the objects to destroy).
 */
export default class ChunkArray<T> implements Iterable<T>
{
    public readonly chunkLength: number;

    get chunkCount(): number
    {
        return this.storage.length;
    }

    get length(): number
    {
        const chunkCount = this.chunkCount;
        const lastChunkLength = this.storage[chunkCount - 1].length;
        return (chunkCount - 1) * this.chunkLength + Math.min(lastChunkLength, this.chunkLength);
    }

    private storage: (T|undefined)[][] = [];


    constructor(chunkLength?: number)
    {
        this.chunkLength = Math.abs(chunkLength || 1000) | 0;
    }


    public getItem(index: number)
    {
        const sub = index % this.chunkLength;
        const sup = (index - sub) / this.chunkLength;

        if (!this.storage[sup])
        {
            return undefined;
        }

        return this.storage[sup][sub];
    }

    public setItem(index: number, value: T)
    {
        const sub = index % this.chunkLength;
        const sup = (index - sub) / this.chunkLength;

        if (!this.storage[sup])
        {
            this.storage[sup] = [];
        }

        return this.storage[sup][sub] = value;
    }

    public hasItem(index: number)
    {
        return this.getItem(index) !== undefined;
    }


    public deleteChunk(chunkIndex: number)
    {
        return delete this.storage[chunkIndex];
    }

    public setChunk(chunkIndex: number, chunk: T[])
    {
        return this.storage[chunkIndex] = chunk;
    }

    public hasChunk(chunkIndex: number)
    {
        return this.storage[chunkIndex] !== undefined;
    }


    public chunkOf(index: number)
    {
        const sub = index % this.chunkLength;
        const sup = (index - sub) / this.chunkLength;

        return sup;
    }

    public firstIndexOf(chunkIndex: number)
    {
        return chunkIndex * this.chunkLength;
    }

    public lastIndexOf(chunkIndex: number)
    {
        return (chunkIndex + 1) * this.chunkLength - 1;
    }


    public sort(compareFn?: (a: number, b: number) => number): ChunkArray<T>
    {
        const arr: T[] = [];

        const l = this.length;
        for (let i = 0; i < l; i++)
        {
            const item = this.getItem(i);
            if (item === undefined)
            {
                continue;
            }
            arr.push(item);
        }

        throw new Error('Not implemented.'); // TODO
    }


    public *[Symbol.iterator](): IterableIterator<T>
    {
        let i = 0;
        while (i < this.length)
        {
            yield this.getItem(i++) as T;
        }
    }
}