import { defineCommand } from 'citty';

export default defineCommand({
    meta: {
        description: 'Print a hello world greeting',
    },
    run() {
        console.log('Hello, world!');
    },
});
