import crypto from 'crypto';

export const generateCodeVerifier = () => {
    return crypto.randomBytes(32).toString('base64url');
};

export const generateCodeChallenge = (codeVerifier) => {
    return crypto
        .createHash('sha256')
        .update(codeVerifier)
        .digest('base64url');
};
