import { SinonSandbox, createSandbox } from 'sinon';

import { NotificationService, NotificationServiceContext } from '@mocks/NotificationService.mock';
import { UserDatabase, UserDatabaseContext } from '@mocks/UserDatabase.mock';
import { EmailClient, EmailClientContext } from '@mocks/EmailClient.mock';

import { Context } from '@src/Context';

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
        const notifyUserSpy = sandbox.spy(NotificationService.prototype, 'notifyUser');
        const getContextSpy = sandbox.spy(Context, 'get');

        const userTrace1 = 'username1';
        const userTrace2 = 'username2';
        await Promise.all([service.notifyUser(userTrace1), service.notifyUser(userTrace2)]);

        // TODO: finish assertions...
    });

    it('should successfully throw Error from inner function', async () => {
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
});
