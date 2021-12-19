import { ContextStore } from '@src/ContextStore';
import { CallStack } from '@src/CallStack';

function isPromise(obj: object) {
    return (
        !!obj &&
        typeof obj['then'] === 'function' &&
        typeof obj['catch'] === 'function' &&
        typeof obj['finally'] === 'function'
    );
}

function invokeInner(innerFunction: any, args: any[], context: object) {
    const stack: CallStack = ContextStore.getLocalStorage().getStore();
    stack.push(context);

    try {
        const result = innerFunction.apply(this, args);
        if (isPromise(result)) {
            return result.finally(() => {
                stack.pop();
            });
        }
        return result;
    } finally {
        stack.pop();
    }
}

function Context(context: object) {
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
    const callStack: CallStack = ContextStore.getLocalStorage().getStore();
    if (!callStack) {
        return null;
    }
    return callStack.getContext();
};

Context.using = function (context: object) {
    const ctxStore = ContextStore.getLocalStorage();
    if (!ctxStore.getStore()) {
        return ctxStore.run(new CallStack(), () => {
            const stack: CallStack = ContextStore.getLocalStorage().getStore();
            stack.push(context);
            return stack.getContext();
        });
    }
    const stack: CallStack = ctxStore.getStore();
    stack.push(context);
    return stack.getContext();
};

export { Context };
