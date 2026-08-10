import { Commander } from '@bleed-believer/commander';

import { serverCommand } from './server/command.js';

const app = new Commander([
    serverCommand,
]);

try {
    await app.run();
} catch (err) {
    console.error(err);
}