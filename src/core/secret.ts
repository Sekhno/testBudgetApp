import crypto from 'node:crypto';

export const secretKey = crypto.randomBytes(64).toString('hex');
