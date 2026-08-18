#!/usr/bin/env bun
import { defineCommand, runMain } from 'citty';
import FetchDocsCommand from './commands/fetch-docs.ts';
import HelloCommand from './commands/hello.ts';

const main = defineCommand({
    meta: {
        name: 'jamendo-openapi',
        description: 'CLI tooling for the jamendo-openapi project',
    },
    subCommands: {
        hello: HelloCommand,
        'fetch-docs': FetchDocsCommand,
    },
});

runMain(main);
