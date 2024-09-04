import axios from "axios";
import { calculateAge } from "../utils/calculateAge.js";
import queryString from "query-string";

const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI
const serverRootUri = process.env.SERVER_ROOT
const googleAuthUrl = process.env.GOOGLE_OAUTH_URL
const googleClientId = process.env.GOOGLE_CLIENT_ID


export const fetchGoogleUserMetaData = async (accessToken) => {
    try {
        const response = await axios.get('https://people.googleapis.com/v1/people/me?personFields=birthdays,genders', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const userDetails = response.data;
        const gender = userDetails.genders ? userDetails.genders[0].value : null;
        const birthdate = userDetails.birthdays ? userDetails.birthdays[0].date : null;
        const age = birthdate ? calculateAge(birthdate) : null;
        // const contacts = await getGoogleUserContacts(access_token);
        // // Process or save the contacts as needed
        // console.log('User contacts:', contacts);

        return { gender, age };
    } catch (error) {
        throw new Error(`Failed to fetch user details: ${error.message}`);
    }
};

//Get access token and id token from google in exchange for code
export const exchangeCodeForTokens = async ({
    code,
    clientId,
    clientSecret,
    redirectUri,
    codeVerifier
}) => {
    const url = process.env.GOOGLE_TOKEN_URL
    const values = {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code_verifier: codeVerifier
    }

    const response = await axios.post(url, queryString.stringify(values), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }
    )

    return response.data
}

export const fetchGoogleUser = async (access_token, id_token) => {
    const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
            headers: {
                Authorization: `Bearer ${id_token}`,
            },
        }
    )
    return response.data
}

export const generateGoogleAuthUrl = (codeChallenge, state) => {
    const rootUrl = googleAuthUrl;
    const options = {
        redirect_uri: `${serverRootUri}/${googleRedirectUri}`,
        client_id: googleClientId,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: "openid profile email",
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256"
    }

    const url = `${rootUrl}?${queryString.stringify(options)}`;
    return url
}

const getGoogleUserContacts = async (accessToken) => {
    const response = await axios.get('https://people.googleapis.com/v1/people/me/connections', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        params: {
            personFields: 'names,emailAddresses', // Specify the fields you want
        },
    });

    return response.data.connections || [];
};