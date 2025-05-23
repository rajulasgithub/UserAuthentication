require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

const PORT = 4000;

app.get('/auth/linkedin', (req, res) => {
  const scope = 'r_liteprofile r_emailaddress';
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
  const clientId = process.env.LINKEDIN_CLIENT_ID;

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

  res.redirect(authUrl);
});

app.get('/auth/linkedin/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) return res.status(400).send('No code provided');

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get user profile
    const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Get user email
    const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const user = {
      id: profileResponse.data.id,
      firstName: profileResponse.data.localizedFirstName,
      lastName: profileResponse.data.localizedLastName,
      email: emailResponse.data.elements[0]['handle~'].emailAddress,
    };

    // Here, create a session or JWT token or send user info to frontend
    // For demo: redirect to frontend with user info in query params (not secure for prod!)
    const frontendUrl = process.env.FRONTEND_URL;
    const redirectUrl = `${frontendUrl}/?user=${encodeURIComponent(JSON.stringify(user))}`;
    res.redirect(redirectUrl);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Failed to authenticate');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});