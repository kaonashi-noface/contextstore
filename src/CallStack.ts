class CallStack {
    private stack: Array<object>;

    constructor() {
        this.stack = [];
    }

    push(context: object): void {
        if (this.isEmpty()) {
            this.stack.push(context);
        } else {
            const currentContext = { ...context };
            const top = this.stack[this.stack.length - 1];
            for (const key of Object.keys(top)) {
                if (!currentContext[key]) {
                    currentContext[key] = top[key];
                }
            }
            this.stack.push(currentContext);
        }
    }

    pop(): object {
        return this.stack.pop();
    }

    isEmpty(): boolean {
        return 0 === this.stack.length;
    }

    getContext(): object {
        if (this.isEmpty()) {
            return null;
        }
        return this.stack[this.stack.length - 1];
    }
}

export { CallStack };
