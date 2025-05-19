const fetch = import("node-fetch");

exports.handler = async ({ queryStringParameters }) => {
    const { code, state } = queryStringParameters;
    // (Optional) Verify `state` matches what you generated in auth-start

    const params = new URLSearchParams({
        client_id:     process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri:  "https://ubiquitous-baklava-ddca01.netlify.app/.netlify/functions/auth-callback",
        state,
    });

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method:  "POST",
        headers: { Accept: "application/json" },
        body:    params,
    });
    const { access_token } = await tokenRes.json();

    return {
        statusCode: 302,
        headers: {
            Location: `https://ozraven.github.io/gitreviewed/#access_token=${access_token}`,
        },
    };
};
