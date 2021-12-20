import { Context } from '@src/Context';

const EmailClientContext = {
    subspanName: 'Client:Email',
    connector: 'sns:topic',
    datatype: 'json',
};

class EmailClient {
    @Context(EmailClientContext)
    publish(username: string): Promise<object> {
        return Promise.resolve(Context.get());
    }
}

export { EmailClient, EmailClientContext };
