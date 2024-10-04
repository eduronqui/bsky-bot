import { AtpAgent } from '@atproto/api';

export class BskyClient {

    #agent = new AtpAgent({
        service: process.env.SERVICE_URL
    });

    /** @property {string} */
    #token = null;

    /**
     * Get all notifications from ATP for the logged in user.
     * @param {string[]} typesToFilter 
     * @returns {object}
     */
    async getNotifications(typesToFilter) {
        const token = await this.#getToken();
        const notifications = await this.#agent.listNotifications(undefined, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (typesToFilter) {
            return notifications.data.notifications.filter(n => typesToFilter.includes(n.reason));
        }

        return notifications.data.notifications;
    }

    /**
     * Post a reply message to a mention.
     * @param {string} message 
     * @param {string} lang
     * @param {object} mention 
     * @returns {Promise<{uri: string, cid: string}>}
     */
    async postReply(message, lang, mention) {

        const replyData = {
            parent: {
                cid: mention.cid,
                uri: mention.uri
            },
            root: {
                cid: mention.record?.reply?.root?.cid ?? mention.cid,
                uri: mention.record?.reply?.root?.uri ?? mention.uri
            }
        };

        return await this.#agent.post({
            langs: [lang],
            text: message,
            reply: replyData,
        });
    }

    /**
     * Get the JWT token for the logged in user.
     * @returns {string}
     */
    async #getToken() {
        if (!this.#token) {
            const loginResponse = await this.#agent.login({
                identifier: process.env.USER_HANDLE,
                password: process.env.USER_PASSWORD
            });

            this.#token = loginResponse.data.accessJwt;
        }

        return this.#token;
    }
}
