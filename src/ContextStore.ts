import { AsyncLocalStorage } from 'async_hooks';
import { CallStack } from '@src/CallStack';

class ContextStore {
    private static CONTEXT_STORE: AsyncLocalStorage<CallStack> = new AsyncLocalStorage<CallStack>();

    static getLocalStorage(): AsyncLocalStorage<CallStack> {
        return ContextStore.CONTEXT_STORE;
    }

    private constructor() {}
}

export { ContextStore };
