import { execute } from './src/bot.js';

try {
    console.log('Running deploy bot')
    await execute();
    console.log('Bot executed successfully');
} catch (err) {
    console.error('Error executing bot', err);
}