import { AsyncLocalStorage } from 'async_hooks';
import { CallStack } from '@src/CallStack';

class ContextStore {
    private static CONTEXT_STORE: AsyncLocalStorage<CallStack<object>> = new AsyncLocalStorage<
        CallStack<object>
    >();

    static getLocalStorage(): AsyncLocalStorage<CallStack<object>> {
        return ContextStore.CONTEXT_STORE;
    }

    private constructor() {}
}

export { ContextStore };
