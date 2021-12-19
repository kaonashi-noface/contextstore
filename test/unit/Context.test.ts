import { Context } from '@src/Context';

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

class EmailClient {
    @Context({ spanName: 'sendEmail' })
    async sendEmail(id: number) {
        // console.log(JSON.stringify(Context.get(), null, 4));
        await sleep(100);
        console.log('Got Users...');
    }
}

class UserService {
    private client: EmailClient;
    constructor() {
        this.client = new EmailClient();
    }

    @Context({ spanName: 'getUser' })
    async getUser(id: number) {
        // console.log(JSON.stringify(Context.get(), null, 4));
        await sleep(100);
        return {
            username: 'username12345',
            firstName: 'John',
            lastName: 'Doe',
        };
    }

    @Context({ spanName: 'notifyUser1' })
    async notifyUser1(id: number) {
        // console.log(JSON.stringify(Context.get(), null, 4));
        await sleep(2500);
        const user = await this.getUser(id);
        await this.client.sendEmail(id);
    }

    @Context({ spanName: 'notifyUser2' })
    async notifyUser2(id: number) {
        console.log(JSON.stringify(Context.get(), null, 4));
        const user = await this.getUser(id);
        console.log(JSON.stringify(Context.get(), null, 4));
        await sleep(5000);
        await this.client.sendEmail(id);
        console.log(JSON.stringify(Context.get(), null, 4));
    }

    // @Context({ spanName: 'initializeService' })
    // initializeService() {
    //     return 5;
    // }
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
