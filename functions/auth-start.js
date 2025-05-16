exports.handler = async () => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirect = encodeURIComponent(
        "https://gitreviewed.netlify.app/.netlify/functions/auth-callback"
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
