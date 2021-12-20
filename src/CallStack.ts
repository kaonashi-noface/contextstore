class CallStack<T extends object> {
    private stack: Array<T>;

    constructor() {
        this.stack = [];
    }

    push(context: T): void {
        if (this.isEmpty()) {
            this.stack.push(context);
            return;
        }
        const currentContext = { ...context };
        const top = this.stack[this.stack.length - 1];
        for (const key of Object.keys(top)) {
            if (!currentContext[key]) {
                currentContext[key] = top[key];
            }
        }
        this.stack.push(currentContext);
    }

    pop(): T {
        return this.stack.pop();
    }

    isEmpty(): boolean {
        return 0 === this.stack.length;
    }

    getContext(): T {
        if (this.isEmpty()) {
            return null;
        }
        return this.stack[this.stack.length - 1];
    }
}

export { CallStack };
