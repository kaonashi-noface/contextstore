type MethodDecorator = (
    target: Object,
    methodName: string | symbol,
    descriptor: PropertyDescriptor
) => void;

/**
 *
 * @param context
 */
declare function Context(context: object): MethodDecorator;
declare namespace Context {
    /**
     * This method returns the context for this function's scope.
     * @returns the context available to this function's scope
     */
    function get(): object;
}

export { Context, MethodDecorator };
