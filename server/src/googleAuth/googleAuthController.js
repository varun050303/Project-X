import queryString from "query-string";
import { setAuthCookie } from "../utils/cookieService";
import { findOrCreateUser } from "../services/user.service";
import { generateToken } from "../utils/tokenService";
import { fetchGoogleAuthToken, fetchGoogleUser, fetchGoogleUserMetaData } from "./googleAuthService";

const google_redirect_uri = process.env.GOOGLE_REDIRECT_URI // as defined in google console
const server_root_uri = process.env.SERVER_ROOT_URI
const client_root_uri = process.env.CLIENT_ROOT_URI
const google_client_id = process.env.GOOGLE_CLIENT_ID
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const SCOPES = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/contacts.readonly",
    "https://www.googleapis.com/auth/user.birthday.read",
    "https://www.googleapis.com/auth/user.gender.read"
].join(' ');


export const generateGoogleAuthUrl = (_, res) => {
    const rootUrl = GOOGLE_AUTH_URL;
    const options = {
        redirect_uri: `${server_root_uri}/${google_redirect_uri}`,
        client_id: google_client_id,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: SCOPES,
    }

    const url = `${rootUrl}?${queryString.stringify(options)}`;
    res.status(200).json({ url });
}


export const handleGoogleLogin = async (req, res) => {
    const { code } = req.query;
    const { id_token, access_token } = await fetchGoogleAuthToken({
        code,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: `${server_root_uri}/${google_redirect_uri}`,
    })

    const googleUser = await fetchGoogleUser(access_token, id_token)
    const { gender, age } = await fetchGoogleUserMetaData(access_token);
    // Attach additional details to the user object
    googleUser.age = age
    googleUser.gender = gender

    const user = await findOrCreateUser(googleUser)
    // Generate JWT token and set it as a cookie
    const token = generateToken(user);
    setAuthCookie(res, token)

    res.redirect(server_root_uri);
}
