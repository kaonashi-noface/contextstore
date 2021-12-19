import { AsyncLocalStorage } from 'async_hooks';
import { CallStack } from './CallStack';

declare class ContextStore {
    private static CONTEXT_STORE: AsyncLocalStorage<CallStack<object>>;

    static getLocalStorage(): AsyncLocalStorage<CallStack<object>>;

    private constructor();
}

export { ContextStore };
