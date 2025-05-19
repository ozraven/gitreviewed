import { graphql } from '@octokit/graphql';
import { useEffect, useState } from 'react';

const graphqlWithAuth = graphql.defaults({
    headers: {
        authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
    },
});

async function fetchOpenPRsByAuthors(authors: string[]) {
    const authorClause = authors.map(author => `author:${author}`).join(' OR ');
    const queryStr = `is:pr is:open ${authorClause}`;
    const { search } = await graphqlWithAuth<{
        search: { nodes: any[] }
    }>(
        `
        query($q: String!) {
            search(type: ISSUE, query: $q, first: 100) {
                nodes {
                    ... on PullRequest {
                        title,
                        url,
                        createdAt,
                        repository { nameWithOwner }
                        author { login }       
                    }
                }
            }
        }
        `,
        { q: queryStr }
    );

    return search.nodes;
}

const Test = () => {
    const [token, setToken] = useState<string | null>(null);
    const [isAuthorizing, setIsAuthorizing] = useState(false);
    
    // Function to handle GitHub OAuth login
    const handleGitHubLogin = () => {
        // GitHub OAuth parameters
        const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
        const redirectUri = window.location.origin;
        const scope = 'repo';
        
        // Redirect to GitHub OAuth authorization page
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    };
    
    // Check for OAuth callback code in URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code && !token && !isAuthorizing) {
            setIsAuthorizing(true);
            
            // Exchange code for token (this would typically be done on a backend)
            // For frontend-only apps, you would need a proxy server to handle this exchange
            // This is a simplified example
            fetch('your-backend-endpoint/exchange-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            })
            .then(response => response.json())
            .then(data => {
                setToken(data.access_token);
                setIsAuthorizing(false);
                
                // Clear the code from the URL
                window.history.replaceState({}, document.title, window.location.pathname);
            })
            .catch(error => {
                console.error('Error exchanging code for token:', error);
                setIsAuthorizing(false);
            });
        }
    }, [token, isAuthorizing]);
    const [prs, setPRs] = useState<any[]>([]);

    useEffect(() => {
        const fetchPRs = async () => {
            const prs = await fetchOpenPRsByAuthors(['erich_adobe']);
            setPRs(prs);
        };

        fetchPRs();
    }, []);

    return (
        <>
            <h1>Test</h1>
            {prs.map((pr) => (
                <div key={pr.url}>
                    <h2>{pr.title}</h2>
                    <p>{pr.createdAt}</p>
                </div>
            ))}
            <div>PRs: {prs.length}</div>
        </>
    )
}

export default Test;