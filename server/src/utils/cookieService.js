export const setAuthCookie = (res, token) => {
    res.cookie(process.env.AUTH_COOKIE_NAME, token, {
        maxAge: 900000,
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
    });
};