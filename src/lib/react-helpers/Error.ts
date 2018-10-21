
// Base Classes

class DescriptiveError extends Error
{
    constructor(message?: string)
    {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = this.constructor.name;

        if (Object.getPrototypeOf(this) === DescriptiveError.prototype)
        {
            console.error('Do not construct DescriptiveError directly, use a subcalss instead!');
        }
    }
}

class DescriptiveTypeError extends TypeError
{
    constructor(message?: string)
    {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = this.constructor.name;

        if (Object.getPrototypeOf(this) === DescriptiveTypeError.prototype)
        {
            console.error('Do not construct DescriptiveTypeError directly, use a subcalss instead!');
        }
    }
}

class DescriptiveRangeError extends RangeError
{
    constructor(message?: string)
    {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = this.constructor.name;

        if (Object.getPrototypeOf(this) === DescriptiveRangeError.prototype)
        {
            console.error('Do not construct DescriptiveRangeError directly, use a subcalss instead!');
        }
    }
}

class DescriptiveSyntaxError extends SyntaxError
{
    constructor(message?: string)
    {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = this.constructor.name;

        if (Object.getPrototypeOf(this) === DescriptiveSyntaxError.prototype)
        {
            console.error('Do not construct DescriptiveSyntaxError directly, use a subcalss instead!');
        }
    }
}

export const _extendErrors =
{
    DescriptiveError,
    DescriptiveRangeError,
    DescriptiveSyntaxError,
    DescriptiveTypeError
};



// Aggregate error

export class AggregateError extends DescriptiveError
{
    constructor(errors: Iterable<Error>);
    constructor(message?: string, errors?: Iterable<Error>);
    constructor(a?: string | Iterable<Error>, b?: Iterable<Error>)
    {
        let message: string|undefined;
        let errors: Iterable<Error>|undefined;

        if (typeof a === 'string')
        {
            message = a;
            if (b && b[Symbol.iterator]) errors = b;
        }
        else if (a && a[Symbol.iterator]) errors = a;

        super(message);

        const errorArray: Error[] = [];

        if (errors)
        for (const err of errors)
        {
            errorArray.push(err);
        }

        this.innerErrors = errorArray;
    }

    public innerErrors: ReadonlyArray<Error>;

    /**
     * Invokes a handler on each Error contained by this AggregateError.
     *
     * @param predictate - The predicate to execute for each error. The predicate accepts as an argument
     * the Error to be processed and returns a boolean to indicate whether the exception was handled.
     *
     * @throws {AggregateError} If any one of the errors hasn't been hangled, a new AggregateError
     * containing those will be thrown.
     */
    public handle(predictate: (err: Error) => boolean)
    {
        const unhandledErrs =
            this.innerErrors.filter(err => !predictate(err));

        if (!unhandledErrs.length) return;

        throw new AggregateError(this.message, unhandledErrs);
    }
}



// General errors

/**
 * The exception that is thrown when an attempt is made to access
 * an element of an array-like type with an index that is outside its bounds.
 */
export class IndexOutOfRangeError extends DescriptiveRangeError
{
    constructor(message?: string)
    {
        super(message);
    }
}

/**
 * The exception that is thrown when an unexpected state happens in a code.
 * Only throw this exception when you're convinced the state cannot ever happen
 * but if it did (because of a bug of some kind), it would have catastrophic consequences.
 */
export class InternalError extends DescriptiveError
{
    constructor(message?: string)
    {
        message = message ? ' ' + message : undefined;
        super('This should not have happened.' + message);
    }
}

/**
 * The exception that is thrown for invalid casting or explicit conversion.
 * This can be thrown from the `valueOf` or `toString` methods.
 */
export class InvalidCastError extends DescriptiveTypeError
{
    constructor(message?: string)
    {
        super(message);
    }
}

/**
 * The exception that is thrown when a method call is invalid for the object's current state.
 */
export class InvalidOperationError extends DescriptiveError
{
    constructor(message?: string)
    {
        super(message);
    }
}

/**
 * The exception that is thrown when a requested method or operation is not implemented.
 */
export class NotImplementedError extends DescriptiveError
{
    constructor(message?: string)
    {
        super(message);
    }
}

/**
 * The exception that is thrown when there is an attempt to dereference a null object reference.
 */
export class NullReferenceError extends DescriptiveTypeError
{
    constructor(message?: string)
    {
        super(message);
    }
}

/**
 * The exception that is thrown when a feature does not run on a particular platform.
 */
export class PlatformNotSupportedError extends DescriptiveError
{
    constructor(message?: string)
    {
        super(message);
    }
}



// Argument errors

/**
 * The exception that is thrown when one of the arguments provided to a method is not valid.
 */
export class ArgumentError extends DescriptiveTypeError
{
    public argumentName?: string;

    constructor(message?: string, argumentName?: string)
    {
        super(message);
        if (argumentName) this.argumentName = argumentName;
    }
}

/**
 * The exception that is thrown when a `null` or `undefined` is passed to a method
 * that does not accept it as a valid argument.
 */
export class ArgumentNullError extends ArgumentError
{
    constructor(message?: string, argumentName?: string)
    {
        super(message, argumentName);
    }
}

/**
 * The exception that is thrown when the value of an argument is outside
 * the allowable range of values as defined by the invoked method.
 */
export class ArgumentOutOfRangeError extends ArgumentError
{
    constructor(message?: string, argumentName?: string)
    {
        super(message, argumentName);
    }
}



// Arithmetic errors

/**
 * The exception that is thrown for errors in an arithmetic,
 * casting, or conversion operation.
 */
export class ArithmeticError extends DescriptiveError
{
    constructor(message?: string)
    {
        super(message);
    }
}

/**
 * The exception that is thrown when there is an attempt to divide
 * by zero in a context where it is not allowed.
 */
export class DivideByZeroError extends ArithmeticError
{
    constructor(message?: string)
    {
        super(message);
    }
}

/**
 * The exception that is thrown when a number is positive infinity, negative infinity,
 * or Not-a-Number (NaN) in a context where it is not allowed.
 */
export class NotFiniteNumberError extends ArithmeticError
{
    constructor(message?: string)
    {
        super(message);
    }
}

/**
 * The exception that is thrown when an arithmetic, casting, or conversion operation
 * results in an overflow in a context where it is not allowed.
 */
export class OverflowError extends ArithmeticError
{
    constructor(message?: string)
    {
        super(message);
    }
}