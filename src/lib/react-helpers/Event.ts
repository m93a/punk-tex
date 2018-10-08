
// tslint:disable:no-shadowed-variable

export interface EventTarget<T extends string = string>
{
    addEventListener(name: T, callback: (data: Event<T>) => void): void;
    removeEventListener(name: T, callback: (data: Event<T>) => void): void;
    dispatchEvent(name: T, data?: Event.Params): void;
}

interface EventSource {}


abstract class EventParams
{
    public source?: EventSource;
    public target?: EventTarget;
}


class Event<T extends string = string> extends EventParams
{
    public name: T;
    public timeStamp: number;

    constructor(name: T, params?: Event.Params)
    {
        super();
        Object.assign(this, params);

        this.name = name;
        this.timeStamp = Date.now();
    }
}


const eventDatabase = new WeakMap<EventTarget, Map<string, Set<(data?: Event) => void>>>();

function accessCallbacks(obj: EventTarget, name: string)
{
    let objectDb = eventDatabase.get(obj);

    if (!objectDb)
    {
        objectDb = new Map();
        eventDatabase.set(obj, objectDb);
    }

    let callbackSet = objectDb.get(name);

    if (!callbackSet)
    {
        callbackSet = new Set();
        objectDb.set(name, callbackSet);
    }

    return callbackSet;
}

class SampleImplementation implements EventTarget
{
    public addEventListener<T extends string>(name: string, callback: (data: Event<T>) => void)
    {
        accessCallbacks(this, name).add(callback);
    }

    public removeEventListener<T extends string>(name: string, callback: (data: Event<T>) => void)
    {
        accessCallbacks(this, name).delete(callback);
    }

    public dispatchEvent(name: string, data?: Event.Params)
    {
        for(const fn of accessCallbacks(this, name))
        {
            fn(new Event(name, data));
        }
    }
}

export const
{
    addEventListener,
    removeEventListener,
    dispatchEvent
}
= SampleImplementation.prototype;


namespace Event
{
    export interface Target extends EventTarget {}
    export interface Params extends EventParams {}
    export const
    {
        addEventListener,
        removeEventListener,
        dispatchEvent
    }
    = SampleImplementation.prototype;
}

export default Event;