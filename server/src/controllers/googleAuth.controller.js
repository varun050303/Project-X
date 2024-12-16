import queryString from "query-string";
import { setAuthCookie } from "../utils/cookieService.js";
import { findOrCreateUser, validateRole } from "../services/user.service.js";
import { generateToken } from "../utils/tokenService.js";
import {
  cleanupAfterLogin,
  exchangeCodeForTokens,
  fetchGoogleUser,
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
  try {
    const { role, action } = req.query;

    // Validate action (must be either 'signup' or 'login')
    if (!action || (action !== "signup" && action !== "login")) {
      throw new ApiError(400, "Invalid action. Must be 'signup' or 'login'.");
    }

    // Validate role only for signup
    let normalizeRole = null;
    if (action === "signup") {
      if (!role) {
        throw new ApiError(400, "Role is required for signup.");
      }
      normalizeRole = role.toUpperCase();
      validateRole(normalizeRole); // Ensure role is valid (e.g., WORKER, CLIENT)
    }

    // Generate PKCE Code Verifier and Code Challenge
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    // Generate a unique state for this request
    const state = generateState();

    // Store code verifier, state, and role (if applicable) for later verification
    await storeCodeVerifier(codeVerifier, state, normalizeRole);

    // Generate Google OAuth URL
    const googleAuthUrl = generateGoogleAuthUrl(codeChallenge, state);

    // Redirect the user to the Google OAuth URL
    res.redirect(googleAuthUrl);
  } catch (error) {
    console.error("Error in handleGoogleAuth:", error);

    // Handle errors gracefully
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
};
// Step 2: Handle the callback after Google redirects back with an authorization code
export const handleGoogleAuthCallback = async (req, res) => {
  const { code, state } = req.query;

  const verifierData = await getCodeVerifier(state);
  if (!verifierData) {
    throw new ApiError(400, "Code verifier is missing");
  }

  const { code: codeVerifier, role } = verifierData;
  if (role) {
    validateRole(role);
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
  googleUser.refresh_token = refresh_token;

  googleUser.role = role;

  const user = await findOrCreateUser(googleUser);

  cleanupAfterLogin(state);

  const tokenPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  // Generate JWT token and set it as a cookie
  const token = generateToken(tokenPayload);
  try {
    setAuthCookie(res, token);
    res.redirect(clientRedirectUri);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
