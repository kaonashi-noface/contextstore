import { Context } from '@src/Context';

const MockContext = {
    key1: 'val1',
    key2: 'val2',
    message:
        'This Context object should be accessible to any deeply nested method in the CallStack.',
};

class DeepStackMock {
    @Context(MockContext)
    method(): object {
        return this.innerOne();
    }

    innerOne(): object {
        return this.innerTwo();
    }

    innerTwo(): object {
        return this.innerThree();
    }

    innerThree(): object {
        return Context.get();
    }
}

export { DeepStackMock, MockContext };
