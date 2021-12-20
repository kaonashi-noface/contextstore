import { AsyncLocalStorage } from 'async_hooks';
import { CallStack } from './CallStack';

/**
 * @class ContextStore
 * @classdesc singleton wrapper for the node `AsyncLocalStorage` hook module.
 * ContextStore is used internally by the `@Context` decorator.
 */
declare class ContextStore {
    private static CONTEXT_STORE: AsyncLocalStorage<CallStack<object>>;

    static getLocalStorage(): AsyncLocalStorage<CallStack<object>>;

    private constructor();
}

export { ContextStore };
