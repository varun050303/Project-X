import queryString from "query-string";
import { setAuthCookie } from "../utils/cookieService.js";
import { findOrCreateUser } from "../services/user.service.js";
import { generateToken } from "../utils/tokenService.js";
import {
  cleanupAfterLogin,
  exchangeCodeForTokens,
  fetchGoogleUser,
  fetchGoogleUserMetaData,
  generateGoogleAuthUrl,
  getCodeVerifier,
  storeCodeVerifier,
} from "../services/googleAuth.service.js";
import { generateCodeChallenge, generateCodeVerifier } from "../utils/pkce.js";
import { ApiError } from "../utils/apiError.js";

import { generateState } from "../utils/generateUUID.js";
const clientRedirectUri = process.env.CLIENT_REDIRECT_URI;

const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;
const serverRootUri = process.env.SERVER_ROOT;

// Step 1: Start the Google OAuth process
export const handleGoogleAuth = async (req, res) => {
  // Generate code_verifier and code_challenge
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = generateState();
  await storeCodeVerifier(codeVerifier, state);

  // Generate the Google OAuth URL
  const googleAuthUrl = generateGoogleAuthUrl(codeChallenge, state);
  // Redirect the user to Google's OAuth URL
  res.redirect(googleAuthUrl);
};

// Step 2: Handle the callback after Google redirects back with an authorization code
export const handleGoogleAuthCallback = async (req, res) => {
  const { code, state } = req.query;

  const codeVerifier = await getCodeVerifier(state);
  if (!codeVerifier) {
    throw new ApiError(400, "Code verifier is missing");
  }

  const { id_token, access_token, refresh_token } = await exchangeCodeForTokens(
    {
      code,
      codeVerifier,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      grantType: "authorization_code",
      redirectUri: `${serverRootUri}/${googleRedirectUri}`,
    }
  );

  const googleUser = await fetchGoogleUser(access_token, id_token);
  // const { gender, age } = await fetchGoogleUserMetaData(access_token);
  // // Attach additional details to the user object
  // googleUser.age = age;
  // googleUser.gender = gender;
  googleUser.refresh_token = refresh_token;

  const user = await findOrCreateUser(googleUser);

  cleanupAfterLogin(state);

  // Generate JWT token and set it as a cookie
  const token = generateToken(user);
  try {
    setAuthCookie(res, token);
    res.redirect(clientRedirectUri);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
