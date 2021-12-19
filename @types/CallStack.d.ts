declare class CallStack<T extends object> {
    private stack: Array<T>;

    constructor();

    /**
     * This method takes a given context object and calculates the new context.
     * The incoming (this) context takes precedence & overrides the previous
     * context at the top of the CallStack. In other words, if the incoming
     * context and the previous context both contain the same key, the
     * incoming value will be used for this context.
     *
     * @param context the context object to push onto the context stack trace.
     */
    push(context: T): void;

    /**
     *
     * @returns
     */
    pop(): T;

    /**
     * Checks to see if the CallStack is empty.
     * @returns
     */
    isEmpty(): boolean;

    /**
     * Retrieves the Context Object at the top of the stack.
     * @returns the Context Object at the top of the stack.
     */
    getContext(): T;
}

export { CallStack };
