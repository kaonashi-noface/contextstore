/**
 * Function signature of the class method the Decorator can attached to.
 */
type MethodDecorator = (
    target: Object,
    methodName: string | symbol,
    descriptor: PropertyDescriptor
) => void;

/**
 * `Context` is a class method decorator (@Context) that synchronizes context objects
 * in a CallStack, irrespective of asynchronous operations & resolutions. The first
 * method to be invoked with `@Context` initiates a new CallStack trace, a pseudo stack
 * frame used to track when a context object should be pushed or popped from the stack.
 * Asynchronously invoking multiple methods that use `@Context` for the first time in
 * their relative stack traces will result in multiple CallStack instantiations.
 * Subsequent invocations with `@Context` will push context objects onto the existing
 * CallStack. When a method with the `@Context` decorator completes, the context will
 * naturally be popped off the CallStack - similar to how method completion removes
 * a stackframe from a CallStack.
 *
 * @param {object} context
 */
declare function Context(context: object): MethodDecorator;
declare namespace Context {
    /**
     * This method returns the context for this function's scope. You can only
     * call this method if the `@Context` decorator is attached to at least one
     * parent function in the current CallStack. `get` will return null if none
     * of the parent methods in this CallStack use the `@Context` decorator.
     *
     * @returns the context available to this function's scope
     */
    function get(): object;
}

export { Context, MethodDecorator };
