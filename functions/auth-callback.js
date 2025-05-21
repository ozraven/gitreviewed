exports.handler = async ({ queryStringParameters }) => {
    const { code, state } = queryStringParameters;
    // (Optional) Verify `state` matches what you generated in auth-start

    const params = new URLSearchParams({
        client_id:     process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri:  `${process.env.OAUTH_CALLBACK_URL}`,
        state,
    });

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method:  'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    params,
    });
    const { access_token } = await tokenRes.json();

    return {
        statusCode: 302,
        headers: {
            //Location: `https://ozraven.github.io/gitreviewed/#access_token=${access_token}`,
            Location: `${process.env.FRONTEND_URL}/#access_token=${access_token}`,
        },
    };
};
