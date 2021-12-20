import { Context } from '@src/Context';

const TopContextOne = {
    key1: 'val1',
    key2: 'val2',
};

const ContextOneA = {
    key2: 'val2_updated',
    key4: 'val4',
};

const ContextOneB = {
    key1: 'val1_update',
    key3: 'val3',
};

const TopContextTwo = {
    key2: 'val2',
    key4: 'val4',
};

const ContextTwoA = {
    key1: 'val3',
    key3: 'val3',
};

const ContextTwoB = {
    key1: 'val1_update',
    key3: 'val3',
};

class MultiStack {
    @Context(TopContextOne)
    async callOne(): Promise<object> {
        await this.callOneA();
        this.callOneB();
        return Context.get();
    }

    @Context(ContextOneA)
    private callOneA(): Promise<object> {
        return Promise.resolve(Context.get());
    }

    @Context(ContextOneB)
    private callOneB(): object {
        return Context.get();
    }

    @Context(TopContextTwo)
    async callTwo(): Promise<object> {
        this.callTwoA();
        await this.callTwoB();
        return Context.get();
    }

    @Context(ContextTwoA)
    private callTwoA(): object {
        return Context.get();
    }

    @Context(ContextTwoB)
    private callTwoB(): Promise<object> {
        return Promise.resolve(Context.get());
    }
}

export {
    MultiStack,
    TopContextOne,
    ContextOneA,
    ContextOneB,
    TopContextTwo,
    ContextTwoA,
    ContextTwoB,
};
