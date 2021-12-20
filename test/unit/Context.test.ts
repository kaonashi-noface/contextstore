import { SinonSandbox, createSandbox } from 'sinon';

import { NotificationService, NotificationServiceContext } from '@mocks/NotificationService.mock';
import { UserDatabase, UserDatabaseContext } from '@mocks/UserDatabase.mock';
import { EmailClientContext } from '@mocks/EmailClient.mock';

import {
    MultiStack,
    TopContextOne,
    ContextOneA,
    ContextOneB,
    TopContextTwo,
    ContextTwoA,
    ContextTwoB,
} from '@mocks/MultiStack.mock';
import { DeepStackMock, MockContext } from '@mocks/DeepStack.mock';

import { Context } from '@src/Context';
import { CallStack } from '@src/CallStack';

describe('@Context Unit TestSuite', () => {
    const sandbox: SinonSandbox = createSandbox();

    const service = new NotificationService();

    afterEach(sandbox.restore);

    it('should successfully synchronize contexts for a single call stack', async () => {
        const notifyUserSpy = sandbox.spy(NotificationService.prototype, 'notifyUser');
        const getContextSpy = sandbox.spy(Context, 'get');

        await service.notifyUser('someusername');

        expect(getContextSpy.firstCall.calledAfter(notifyUserSpy.firstCall)).toBeTruthy();
        expect(
            getContextSpy.firstCall.returned({
                ...NotificationServiceContext,
                ...UserDatabaseContext,
            })
        ).toBeTruthy();
        expect(getContextSpy.secondCall.calledAfter(notifyUserSpy.firstCall)).toBeTruthy();
        expect(
            getContextSpy.secondCall.returned({
                ...NotificationServiceContext,
                ...EmailClientContext,
            })
        ).toBeTruthy();
        expect(getContextSpy.thirdCall.calledAfter(notifyUserSpy.firstCall)).toBeTruthy();
        expect(getContextSpy.thirdCall.returned(NotificationServiceContext)).toBeTruthy();
    });

    it('should successfully synchronize contexts for a multiple call stacks', async () => {
        const getContextSpy = sandbox.spy(Context, 'get');

        const mockService = new MultiStack();

        await Promise.all([mockService.callOne(), mockService.callTwo()]);

        const contexts = getContextSpy.returnValues;

        const stackOne = new CallStack();
        stackOne.push(TopContextOne);
        stackOne.push(ContextOneA);
        expect(contexts).toContainEqual(stackOne.getContext());
        stackOne.pop();
        stackOne.push(ContextOneB);
        expect(contexts).toContainEqual(stackOne.getContext());
        stackOne.pop();
        expect(contexts).toContainEqual(stackOne.getContext());

        const stackTwo = new CallStack();
        stackTwo.push(TopContextTwo);
        stackTwo.push(ContextTwoA);
        expect(contexts).toContainEqual(stackTwo.getContext());
        stackTwo.pop();
        stackTwo.push(ContextTwoB);
        expect(contexts).toContainEqual(stackTwo.getContext());
        stackTwo.pop();
        expect(contexts).toContainEqual(stackTwo.getContext());
    });

    it('should successfully get context for deeply nested function', () => {
        const mockService = new DeepStackMock();
        const actualCtx = mockService.method();
        expect(actualCtx).toEqual(MockContext);
    });

    it('should not return context when used outside of the @Context scope', async () => {
        const context = Context.get();
        expect(context).toBeNull;
    });

    it('should successfully throw Error from async inner function', async () => {
        const expectedError = new Error('Stubbed Error');
        sandbox.stub(UserDatabase.prototype, 'getUser').rejects(expectedError);

        try {
            await service.notifyUser('someusername');
        } catch (err) {
            expect(err).toBeInstanceOf(Error);
            expect(err.name).toEqual(expectedError.name);
            expect(err.message).toEqual(expectedError.message);
            return;
        }
        fail(`Should throw ${expectedError.message} from inner function.`);
    });

    it('should successfully throw Error from sync inner function', () => {
        const expectedError = new Error('Stubbed Error From Deeply Nested Function');
        sandbox.stub(DeepStackMock.prototype, 'innerThree').throws(expectedError);
        const mockService = new DeepStackMock();

        try {
            mockService.method();
        } catch (err) {
            expect(err).toBeInstanceOf(Error);
            expect(err.name).toEqual(expectedError.name);
            expect(err.message).toEqual(expectedError.message);
            return;
        }
        fail(`Should throw ${expectedError.message} from inner function.`);
    });
});
