import { Context } from '@src/Context';

const UserDatabaseContext = {
    subspanName: 'Database:User',
    connector: 'aurora:postgresql',
    table: 'user_table',
};

class UserDatabase {
    @Context(UserDatabaseContext)
    getUser(username: string): Promise<object> {
        return Promise.resolve(Context.get());
    }
}

export { UserDatabase, UserDatabaseContext };
