import { createClient } from 'redis';

export class RedisClient {

    #client = createClient({
        url: process.env.REDIS_URL
    });

    constructor() {
        this.#client.connect();
    }

    /**
     * Check if a cid is already saved in Redis.
     * @param {string} cid 
     * @returns {Promise<boolean>}
     */
    async hasCid(cid) {
        const value = await this.#client.get(cid);
        return value && value === 'cid';
    }

    /**
     * Save a cid in Redis.
     * @param {string} cid 
     */
    async saveCid(cid) {
        await this.#client.set(cid, 'cid');
    }
}