/**
 * @class CallStack
 * @classdesc object representation of a `@Context` callstack. When a method with
 * the `@Context` class method decorator is invoked, the context is pushed onto
 * the CallStack.
 *
 * @template T generic type that extends object
 */
declare class CallStack<T extends object> {
    constructor();

    /**
     * This method takes a given context object and calculates the new context.
     * The incoming context takes precedence & overrides the previous context
     * at the top of the CallStack. In other words, if the incoming context and
     * the previous context both contain the same key, the incoming value will
     * be used for this context.
     *
     * @param {T} context the context object to push onto the context stack trace
     */
    push(context: T): void;

    /**
     * Pops off and returns the context located at the top of the call stack.
     *
     * @returns {T} returns the context at the top of the call stack
     */
    pop(): T;

    /**
     * Checks to see if the CallStack is empty.
     *
     * @returns `true` if there are no contexts in the stack. `false` if there
     * there are contexts in this CallStack.
     */
    isEmpty(): boolean;

    /**
     * Retrieves the calculated context object at the top of the stack.
     *
     * @returns the context object at the top of the stack
     */
    getContext(): T;
}

export { CallStack };
