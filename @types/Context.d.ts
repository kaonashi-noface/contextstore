/**
 * Function signature of the class method the Decorator can attached to.
 */
type MethodDecorator = (
    target: Object,
    methodName: string | symbol,
    descriptor: PropertyDescriptor
) => void;

/**
 * The `@Context` decorator
 * @param context
 */
declare function Context(context: object): MethodDecorator;
declare namespace Context {
    /**
     * This method returns the context for this function's scope. You can only
     * call this method if the `@Context` decorator is attached to a parent
     * function in the current CallStack.
     *
     * @returns the context available to this function's scope
     */
    function get(): object;
}

export { Context, MethodDecorator };
