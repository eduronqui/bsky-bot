import { reasons } from './reasons.js';

/**
 * Get a random message based on the day and language. 
 * @param {string} lang 
 * @returns {string}
 */
export function getMessage(lang) {
    const dayOfWeek = new Date().getDay();

    if ([0, 6].includes(dayOfWeek)) {
        const idx = Math.floor(Math.random() * reasons.no.weekend[lang].length);
        return reasons.no.weekend[lang][idx];
    }

    if (dayOfWeek === 5) {
        const idx = Math.floor(Math.random() * reasons.no.friday[lang].length);
        return reasons.no.friday[lang][idx];
    }

    return reasons.yes[lang][idx];
}

export const defaultMessage = {
    ...reasons.dunno
};
