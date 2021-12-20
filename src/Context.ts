import { ContextStore } from '@src/ContextStore';
import { CallStack } from '@src/CallStack';
import { MethodDecorator } from '@types';

function isPromise(obj: object) {
    return (
        !!obj &&
        typeof obj['then'] === 'function' &&
        typeof obj['catch'] === 'function' &&
        typeof obj['finally'] === 'function'
    );
}

function invokeInner(innerFunction: any, args: any[], context: object) {
    const stack: CallStack<object> = ContextStore.getLocalStorage().getStore();
    stack.push(context);
    try {
        const result = innerFunction.apply(this, args);
        if (isPromise(result)) {
            return result.finally(() => {
                stack.pop();
            });
        }
        stack.pop();
        return result;
    } catch (err) {
        stack.pop();
        throw err;
    }
}

function Context(context: object): MethodDecorator {
    return function (target: Object, methodName: string | symbol, descriptor: PropertyDescriptor) {
        const method = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const ctxStore = ContextStore.getLocalStorage();
            if (!ctxStore.getStore()) {
                return ctxStore.run(new CallStack(), () => {
                    return invokeInner.apply(this, [method, args, context]);
                });
            }
            return invokeInner.apply(this, [method, args, context]);
        };
    };
}

Context.get = function (): object {
    const callStack: CallStack<object> = ContextStore.getLocalStorage().getStore();
    if (!callStack) {
        return null;
    }
    return callStack.getContext();
};

export { Context };
