import queryString from "query-string";
import { setAuthCookie } from "../utils/cookieService.js";
import { findOrCreateUser } from "../services/user.service.js";
import { generateToken } from "../utils/tokenService.js";
import { exchangeCodeForTokens, fetchGoogleUser, fetchGoogleUserMetaData, generateGoogleAuthUrl } from "../services/googleAuthService.js";
import { generateCodeChallenge, generateCodeVerifier } from "../utils/pkce.js";

const clientRootUri = process.env.CLIENT_ROOT_URI

const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI
const serverRootUri = process.env.SERVER_ROOT_URI
const googleAuthUrl = process.env.GOOGLE_OAUTH_URL
const googleClientId = process.env.GOOGLE_CLIENT_ID

// Step 1: Start the Google OAuth process
export const handleGoogleAuth = (req, res) => {
    // Generate code_verifier and code_challenge
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    // Store the code_verifier in the session
    req.session.codeVerifier = codeVerifier;
    // Generate the Google OAuth URL
    const googleAuthUrl = generateGoogleAuthUrl(codeChallenge);
    // Redirect the user to Google's OAuth URL
    res.redirect(googleAuthUrl);
}

// Step 2: Handle the callback after Google redirects back with an authorization code
export const handleGoogleAuthCallback = async (req, res) => {
    const { code } = req.query;

    const codeVerifier = req.session.codeVerifier;
    if (!codeVerifier) {
        return res.status(400).json({ error: 'Code verifier is missing' });
    }

    const { id_token, access_token, refresh_token } = await exchangeCodeForTokens({
        code,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        grantType: "authorization_code",
        codeVerifier: codeVerifier,
        redirectUri: `${serverRootUri}/${googleRedirectUri}`,
    });


    const googleUser = await fetchGoogleUser(access_token, id_token)
    const { gender, age } = await fetchGoogleUserMetaData(access_token);
    // Attach additional details to the user object
    googleUser.age = age
    googleUser.gender = gender

    const user = await findOrCreateUser(googleUser)
    // Generate JWT token and set it as a cookie
    const token = generateToken(user);
    setAuthCookie(res, token)

    res.redirect(clientRootUri);
}
