import { BskyClient } from './bsky-client.js';
import { getMessage, defaultMessage } from './message.js';
import { RedisClient } from './redis-client.js';

const DEPLOY_MSG_PATTERN = /(deploy).*(hoje|today)/gi;

export async function execute() {
    const redisClient = new RedisClient();
    const bskyClient = new BskyClient();
    const mentions = await bskyClient.getNotifications(['mention']);

    mentions.forEach(async (mention) => {
        console.log(`Replying message: ${mention.cid}`);

        if (await redisClient.hasCid(mention.cid)) {
            console.log('Message already replied');
            return;
        }

        const lang = mention.record.langs[0] === 'pt' ? 'pt' : 'en';

        let message = defaultMessage[lang];

        if (DEPLOY_MSG_PATTERN.test(mention.record.text)) {
            message = getMessage(lang);
        }

        await bskyClient.postReply(message, lang, mention);
        await redisClient.saveCid(mention.cid);
        console.log('Message replied');
    });
}
