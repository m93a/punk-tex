
type callback = (...params: any[]) => any;

function isObject(x: unknown): x is object
{
    return (typeof x === "object" || typeof x === "function") && x !== null;
}

class WeakishMultimap<K,U>
{
    public m = new Map<K, U>();
    public w = new WeakMap<object, U>();
    public M = new Map<K, WeakishMultimap<K,U>>();
    public W = new WeakMap<object, WeakishMultimap<K,U>>();

    public getValue(key: K)
    {
        return isObject(key) ? this.w.get(key) : this.m.get(key);
    }

    public setValue(key: K, value: U)
    {
        isObject(key) ? this.w.set(key, value) : this.m.set(key, value);
        return this;
    }

    public hasValueWithKey(key: K)
    {
        return isObject(key) ? this.w.has(key) : this.m.has(key);
    }

    public getSubmap(key: K)
    {
        return isObject(key) ? this.W.get(key) : this.M.get(key);
    }

    public setSubmap(key: K, submap: WeakishMultimap<K, U>)
    {
        isObject(key) ? this.W.set(key, submap) : this.M.set(key, submap);
        return this;
    }

    public hasSubmapWithKey(key: K)
    {
        return isObject(key) ? this.W.has(key) : this.M.has(key);
    }

    public newSubmap(key: K)
    {
        const submap = new WeakishMultimap<K, U>();
        isObject(key) ?
            this.W.set(key, submap):
            this.M.set(key, submap);

        return submap;
    }

    public getOrNewSubmap(key: K)
    {
        return this.hasSubmapWithKey(key) ?
            this.getSubmap(key) as WeakishMultimap<K, U>:
            this.newSubmap(key);
    }

    public getOrSetValue(key: K, defaultValue: U)
    {
        return this.hasValueWithKey(key) ?
            this.getValue(key) as U:
            (this.setValue(key, defaultValue), defaultValue);
    }

}

export default function LambdaCache()
{
    const cache = new WeakishMultimap<unknown, callback>();

    function CacheOrRetrieve<C extends callback>(key: any, lambda: C): C
    function CacheOrRetrieve<C extends callback>(key1: any, key2: any, lambda: C): C
    function CacheOrRetrieve<C extends callback>(key1: any, key2: any, key3: any, lambda: C): C
    function CacheOrRetrieve<C extends callback>(key1: any, key2: any, key3: any, key4: any, lambda: C): C
    function CacheOrRetrieve<C extends callback>(key1: any, key2: any, key3: any, key4: any, key5: any, lambda: C): C
    function CacheOrRetrieve<C extends callback>(key1: any, key2: any, key3: any, key4: any, key5: any, key6: any, lambda: C): C
    function CacheOrRetrieve<C extends callback>(key1: any, key2: any, key3: any, key4: any, key5: any, key6: any, key7: any, lambda: C): C
    function CacheOrRetrieve<C extends callback>(key1: any, key2: any, key3: any, key4: any, key5: any, key6: any, key7: any, key8: any, lambda: C): C
    function CacheOrRetrieve<C extends callback>(key1: any, key2: any, key3: any, key4: any, key5: any, key6: any, key7: any, key8: any, key9: any, lambda: C): C
    function CacheOrRetrieve<C extends callback>(key1: any, key2: any, key3: any, key4: any, key5: any, key6: any, key7: any, key8: any, key9: any, key10: any, lambda: C): C
    function CacheOrRetrieve(...params: any[]): callback

    function CacheOrRetrieve(...keys: unknown[]): callback
    {
        let map = cache;
        const len = keys.length;

        for (let i = 0; i < len - 2; i++)
        {
            const key = keys[i];
            map = map.getOrNewSubmap(key);
        }

        const lastKey = keys[len-2];
        const fn = keys[len-1];

        if (typeof fn !== 'function')
        throw new TypeError('The last parameter has to be a function.');

        return map.getOrSetValue(lastKey, fn as () => any);
    }

    return CacheOrRetrieve;
}