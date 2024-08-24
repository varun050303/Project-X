

const refreshAccessToken = async (refreshToken) => {
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const params = {
        client_id: 'YOUR_CLIENT_ID', // Replace with your Client ID
        client_secret: 'YOUR_CLIENT_SECRET', // Replace with your Client Secret
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
    };

    const response = await axios.post(tokenUrl, queryString.stringify(params), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    return response.data; // Contains new access_token
};

// Example of using the refresh token to get a new access token
app.get('/refresh-token', async (req, res) => {
    const refreshToken = req.query.refreshToken; // Retrieve from your database or session
    const tokens = await refreshAccessToken(refreshToken);

    // Update user's access token in your database/session
    res.json({ access_token: tokens.access_token });
});