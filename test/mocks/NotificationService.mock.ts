import { Context } from '@src/Context';

import { UserDatabase } from '@mocks/UserDatabase.mock';
import { EmailClient } from '@mocks/EmailClient.mock';

const NotificationServiceContext = {
    spanName: 'NotificationService:notifyUser(...)',
    endpoint: '/notify/user/{username}',
};

class NotificationService {
    private userDb: UserDatabase = new UserDatabase();
    private emailClient: EmailClient = new EmailClient();

    @Context(NotificationServiceContext)
    async notifyUser(username: string): Promise<object> {
        await this.userDb.getUser(username);
        await this.emailClient.publish(username);
        return Context.get();
    }
}

export { NotificationService, NotificationServiceContext };
