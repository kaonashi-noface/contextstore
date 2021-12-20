import { CallStack } from '@src/CallStack';

describe('CallStack Unit TestSuite', () => {
    const stack = new CallStack();

    it('should successfully calculate contexts in CallStack', () => {
        const contexts = [
            {
                key1: 'val1',
                key2: 'val2',
                key3: 'val3',
            },
            {
                key2: 'val2_updated',
                key3: 'val3_updated',
            },
            {
                key1: 'val1_updated',
                key4: 'val4',
            },
        ];

        stack.push(contexts[0]); // [ contexts[0] ]
        expect(stack.getContext()).toEqual({
            key1: 'val1',
            key2: 'val2',
            key3: 'val3',
        });

        stack.push(contexts[1]); // [ contexts[0], contexts[1] ]
        expect(stack.getContext()).toEqual({
            key1: 'val1',
            key2: 'val2_updated',
            key3: 'val3_updated',
        });

        stack.pop(); // [ contexts[0] ]
        expect(stack.getContext()).toEqual({
            key1: 'val1',
            key2: 'val2',
            key3: 'val3',
        });

        stack.push(contexts[2]); // [ contexts[0], contexts[2] ]
        expect(stack.getContext()).toEqual({
            key1: 'val1_updated',
            key2: 'val2',
            key3: 'val3',
            key4: 'val4',
        });

        stack.pop(); // [ contexts[0] ]
        expect(stack.getContext()).toEqual({
            key1: 'val1',
            key2: 'val2',
            key3: 'val3',
        });

        stack.pop(); // []
        expect(stack.getContext()).toBeNull;
    });
});
