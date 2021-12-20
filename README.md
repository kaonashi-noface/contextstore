# ctxstore

<a href="https://app.circleci.com/pipelines/github/kaonashi-noface/contextstore?branch=main&filter=all">
    <img src="https://circleci.com/gh/kaonashi-noface/contextstore.svg?style=svg" alt="CircleCI Build" />
</a>
<a href='https://coveralls.io/github/kaonashi-noface/contextstore?branch=main'>
    <img src='https://coveralls.io/repos/github/kaonashi-noface/contextstore/badge.svg?branch=main' alt='Code Coverage' />
</a>
<a href='https://www.npmjs.com/package/ctxstore'>
    <img alt="npm version" src="https://img.shields.io/npm/v/ctxstore" />
</a>
<a href='https://www.npmjs.com/package/ctxstore'>
    <img alt="license" src="https://img.shields.io/npm/l/ctxstore" />
</a>
<a href='https://www.npmjs.com/package/ctxstore'>
    <img alt="downloads" src="https://img.shields.io/npm/dm/ctxstore" />
</a>

# About

ContextStore (`ctxstore`) is a context decorator library designed for nodejs that synchronizes contexts within a call stack.

> Disclaimer: This module has not been tested for multithreading nor designed with multithreading in mind.

# Installation

Installing with npm:

```bash
npm i ctxstore
```

# Usage

## @Context decorator

Use the `@Context` decorator to associate a context object with a scope:

```ts
import { Context } from 'ctxstore';

class NotificationService {
    private userDb: UserDatabase = new UserDatabase();
    private emailClient: EmailClient = new EmailClient();

    @Context({
        // Associate a context to a scope
        spanName: 'NotificationService:notifyUser(...)',
        endpoint: '/notify/user/{username}',
    })
    async notifyUser(username: string): Promise<object> {
        await this.userDb.getUser(username);
        await this.emailClient.publish(username);
        return Context.get(); // retrieve the context for this scope
    }
}
```

In this example, a context is being associated with the `async notifyUser(username: string): Promise<object>` method. This means that any function invoked in scope of `notifyUser(...) { }` will have access to the context(s) defined in `@Context(...)`. You can use the `Context.get` method to retrieve the context for a function (e.g. `notifyUser(...) { }`) as long as at least one ancestor function in the same call stack defines a context with `@Context(...)`.

```ts
import { Context } from 'ctxstore';

class ExampleService {
    @Context({
        message: 'hello world',
    })
    method(): string {
        return this.innerOne();
    }

    innerOne() {
        return this.innerTwo();
    }

    innerTwo() {
        return Context.get(); // <--- returns 'hello world'
    }
}
```

In the example above, `Context.get()` will still have access to `method()`'s context because the inner methods are within `method()`'s scope.

# Understanding

ContextStore handles the management of a Context object similar to how function lifecycles are managed in a CallStack/ StackFrame. When a function completes, its stack frame is naturally popped off the call stack; `@Context` functions the same way. When a method with a `@Context` is invoked, the context object is pushed onto a CallStack. When a method with a `@Context` `completes` (irrespective of whether it's synchronous or asynchronous), the context object is popped off the CallStack. Incoming context object keys take precedence over context objects existing on the CallStack. If the incoming context and the context located at the top of the stack both share the same key, the value of the incoming context object will "mask" the value of the context on the stack.

> NOTE: A `CallStack` object is instantiated when the `@Context` decorator is encountered for the first time in a call stack trace.

Let's take a look at the following examples.

`class UserDatabase`:

```ts
class UserDatabase {
    @Context({
        subspanName: 'Database:User',
        connector: 'aurora:postgresql',
        table: 'user_table',
    })
    getUser(username: string): Promise<object> {
        return Promise.resolve(Context.get());
    }
}
```

`class EmailClient`:

```ts
class EmailClient {
    @Context({
        subspanName: 'Client:Email',
        connector: 'sns:topic',
        datatype: 'json',
    })
    publish(username: string): Promise<object> {
        return Promise.resolve(Context.get());
    }
}
```

`class NotificationService`:

```ts
class NotificationService {
    private userDb: UserDatabase = new UserDatabase();
    private emailClient: EmailClient = new EmailClient();

    @Context({
        spanName: 'NotificationService:notifyUser(...)',
        endpoint: '/notify/user/{username}',
    })
    async notifyUser(username: string): Promise<object> {
        await this.userDb.getUser(username);
        await this.emailClient.publish(username);
        return Context.get();
    }
}
```

If we invoke `notifyUser`:

```ts
await notifyUser('userId123');
```

The context object returned by `Context.get()` inside of `notifyUser` will be:

```ts
async notifyUser(username: string): Promise<object> {
    ...
    const ctx = Context.get();
    ctx will be:
    {
        spanName: 'NotificationService:notifyUser(...)',
        endpoint: '/notify/user/{username}',
    };
}
```

The context object returned by `Context.get()` inside of `getUser` will be:

```ts
getUser(username: string): Promise<object> {
    ...
    const ctx = Context.get();
    ctx will be:
    {
        spanName: 'NotificationService:notifyUser(...)',
        endpoint: '/notify/user/{username}',
        subspanName: 'Database:User',
        connector: 'aurora:postgresql',
        table: 'user_table',
    };
}
```

If `getUser`'s context had a `spanName` property (e.g. `UserDatabase:getUser(...)`), then `getUser`'s `spanName` property would override the context from `notifyUser`.

If we attempt to concurrently handle multiple `notifyUser` invocations:

```ts
await Promise.all([notifyUser('userId123'), notifyUser('userId456')]);
```

A context CallStack is instantiated per `notifyUser` invocation since this is the first usage of `@Context` within this context scope. Although asynchronous function resolutions (inner and top level) are unpredictable, `ctxstore` is capable of synchronizing contexts with their associated CallStacks. In other words, contexts won't get jumbled/ mixed up despite the chaotic nature of asynchrony.

# Upcoming Features

## function Context(target: Object, propertyKey: string | symbol, parameterIndex: number) : void

There is a compelling reason to support `@Context` as a parameter decorator.

```ts
class Lambda {
    private userDb: UserDatabase = new UserDatabase();
    private emailClient: EmailClient = new EmailClient();

    @Context({
        method: 'GET',
        path: '/organization/{organization}/user/{userId}',
    })
    async handler(event, @Context context): Promise<Response> {
        logger.info('Start Trace Logging...', { trace, context});
        return {
            body: {
                ...
            },
            statusCode: ...
        };
    }
}
```

Supporting parameter decorators reduces the overhead of boilerplate and complexity for the user. Unfortunately, parameter decorators do not function similarly to CallStacks, there is no way to determine when the decorated function has completed from the perspective of a parameter decorator. This makes management of a context trace difficult.

# License

Copyright 2021. Licensed [MIT](https://github.com/kaonashi-noface/contextstore/blob/main/LICENSE).
