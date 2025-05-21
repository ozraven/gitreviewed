exports.handler = async () => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirect = encodeURIComponent(
        //"https://ubiquitous-baklava-ddca01.netlify.app/.netlify/functions/auth-callback"
        process.env.OAUTH_CALLBACK_URL
    );
    const state = Math.random().toString(36).slice(2);

    // (Optional) Persist `state` in a cookie or in-memory store for CSRF protection

    return {
        statusCode: 302,
        headers: {
        Location:
            `https://github.com/login/oauth/authorize` +
            `?client_id=${clientId}` +
            `&redirect_uri=${redirect}` +
            `&scope=repo` +
            `&state=${state}`,
        },
    };
};
