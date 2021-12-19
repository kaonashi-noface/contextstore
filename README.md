# ctxstore
<a href="https://app.circleci.com/pipelines/github/kaonashi-noface/ctxstore?branch=main&filter=all">
    <img src="https://circleci.com/gh/kaonashi-noface/ctxstore.svg?style=svg" alt="CircleCI Build" />
</a>
<a href='https://coveralls.io/github/kaonashi-noface/ctxstore?branch=main'>
    <img src='https://coveralls.io/repos/github/kaonashi-noface/ctxstore/badge.svg?branch=main' alt='Code Coverage' />
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

A context decorator library designed for nodejs that harmonizes contexts within a call stack.

> WARNING: This module does not yet have any functionality.
> 
> Please do not install this module and expect it to work until you see v1.0.0.

# Proposal
ContextStore treats the context objects similar to function call stacks. A child Context will be attached to Context associated with the current call stack whenever a function tagged with the `@Context` annotation is invoked.

Let's assume the following:
```ts
class Example {
    @Context()
    async foo() {
        await this.a();
    }

    @Context()
    async bar() {
        await this.a();
    }

    @Context()
    async a() {
        await this.b();
    }

    @Context()
    async b() { /*...*/ }
}

const example = new Example();
await Promise.all([
    example.foo(),
    example.bar(),
]);
```

Handling multiple asynchronous functions will result in an upredictable resolution order. There is no guarantee which top level or inner async call will finish first or in what order. `ctxstore` aims to associate the invocation instance to the correct "frame of reference", even if some function calls are shared (e.g. `foo()` and `bar()` both invoke `a()`).

Proposed usage of Context Frame:
```ts
class SNSClient {
    private sns: SNS;
    
    @Context({ spanName: 'SNS:NotifyUsers' })
    publish(event) {
        return sns.publish({ /*...event...*/ }).promise();
    }
}

class UserService {
    @Context({ spanName: 'UserService:getUsers' })
    getUsers(event) { /*...get users...*/ }
}

class NotificationService {
    private snsClient: SNSClient;

    @Context({ spanName: 'NotificationService:notifyUsers' })
    notifyUsers() { /*...notify users...*/ }
}

import { Context } from 'ctxstore';

class Lambda {
    private userService: UserService;
    private notificationService: NotificationService;

    constructor() { /*...setup lambda...*/ }

    async handler(event, @Context context) {
        const users: User[] = await userService.getUsers(event);
        await notificationService.notifyUsers(users, event);
        return {
            statusCode: 200
        }
    }
}

// entry point:
await new Lambda().handler(/*...params...*/);
```

The parameter annotation `@Context context` will create the root of the Context tree because `ctxstore` will recognize this call stack does not have a Context Frame initialized. `ctxstore` will create and associate a Context with the correct "frame of reference" everytime a new function is invoked with the `@Context` annotation.