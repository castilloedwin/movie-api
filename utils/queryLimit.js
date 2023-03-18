import { messages } from './messages';

const queryLimit = (data, limit) => {
    const max = 20;
    const min = 1;
    if (limit < min || limit > max) return { status: 400, message: messages.limit };
    return JSON.parse(data).filter((movie, index) => index < limit);
};

export { queryLimit };