import { Context } from '@src/Context';

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

class EmailClient {
    @Context({ spanName: 'sendEmail' })
    async sendEmail(id: number) {
        await sleep(100);
    }
}

class UserService {
    private client: EmailClient;
    constructor() {
        this.client = new EmailClient();
    }

    @Context({ spanName: 'getUser' })
    async getUser(id: number) {
        await sleep(100);
        return {
            username: 'username12345',
            firstName: 'John',
            lastName: 'Doe',
        };
    }

    @Context({ spanName: 'notifyUser1' })
    async notifyUser1(id: number) {
        await sleep(2500);
        const user = await this.getUser(id);
        await this.client.sendEmail(id);
    }

    @Context({ spanName: 'notifyUser2' })
    async notifyUser2(id: number) {
        const user = await this.getUser(id);
        await sleep(5000);
        await this.client.sendEmail(id);
    }
}

(async () => {
    const userService = new UserService();
    // const value = userService.initializeService();
    // await userService.notifyUser1(1);
    // await userService.notifyUser2(2);

    await Promise.all([userService.notifyUser1(1), userService.notifyUser2(2)]);
    const foo = Context.get();
    const msg = '';
})();
