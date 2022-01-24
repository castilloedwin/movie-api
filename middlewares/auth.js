import { decodeAccessToken } from '../services';

const auth = (req, res, next) => {
    if (!req.headers.authorization) return res.status(403).json({ status: 403, message: 'Forbidden' });
    const token = req.headers.authorization.split(' ')[1];
    if (!decodeAccessToken(token)) return res.status(401).json({ status: 401, message: 'Invalid token or it has expired' });
    next();
}

export default auth;