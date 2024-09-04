import queryString from "query-string";
import { setAuthCookie } from "../utils/cookieService.js";
import { findOrCreateUser } from "../services/user.service.js";
import { generateToken } from "../utils/tokenService.js";
import { exchangeCodeForTokens, fetchGoogleUser, fetchGoogleUserMetaData, generateGoogleAuthUrl } from "../services/googleAuth.service.js";
import { generateCodeChallenge, generateCodeVerifier } from "../utils/pkce.js";
import { ApiError } from "../utils/apiError.js";
import { getCodeVerifier, storeCodeVerifier } from "../services/supabase.service.js";
import { generateState } from "../utils/generateUUID.js";
const clientRedirectUri = process.env.CLIENT_REDIRECT_URI

const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI
const serverRootUri = process.env.SERVER_ROOT

// Step 1: Start the Google OAuth process
export const handleGoogleAuth = async (req, res) => {
    // Generate code_verifier and code_challenge
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = generateState()
    const expiresAt = new Date(Date.now() + 180 * 1000); // 10 minutes expiration
    await storeCodeVerifier(codeVerifier, expiresAt, state);

    // Generate the Google OAuth URL
    const googleAuthUrl = generateGoogleAuthUrl(codeChallenge, state);
    // Redirect the user to Google's OAuth URL
    res.redirect(googleAuthUrl);
}

// Step 2: Handle the callback after Google redirects back with an authorization code
export const handleGoogleAuthCallback = async (req, res) => {
    const { code, state } = req.query;

    const codeVerifier = getCodeVerifier(state)
    if (!codeVerifier) {
        throw new ApiError(400, "Code verifier is missing")
    }

    console.log('code verifier is present')

    const { id_token, access_token, refresh_token } = await exchangeCodeForTokens({
        code,
        codeVerifier,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        grantType: "authorization_code",
        redirectUri: `${serverRootUri}/${googleRedirectUri}`,
    });

    console.log('code exchanged for token')

    const googleUser = await fetchGoogleUser(access_token, id_token)
    const { gender, age } = await fetchGoogleUserMetaData(access_token);
    // Attach additional details to the user object
    googleUser.age = age
    googleUser.gender = gender
    googleUser.refresh_token = refresh_token

    const user = await findOrCreateUser(googleUser)
    // Generate JWT token and set it as a cookie
    const token = generateToken(user);
    setAuthCookie(res, token)
    console.log('user created redirecting to page')
    res.redirect(clientRedirectUri);
}
