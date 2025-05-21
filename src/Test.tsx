import { useEffect, useState } from 'react';
import { useGitHubLogin } from './GitHubLogin';
import { graphql } from '@octokit/graphql';

interface Repo {
    name: string;
    url: string;
}

interface ViewerData {
    login: string;
    repositories: {
        totalCount: number;
        nodes: Repo[];
    };
}

async function fetchViewerRepos(token: string): Promise<ViewerData> {
    const client = graphql.defaults({
        headers: {
            authorization: `token ${token}`,
        },
    });

    const query = /* GraphQL */ `
        query {
            viewer {
                login
                repositories(first: 10, orderBy: { field: UPDATED_AT, direction: DESC}) {
                    totalCount
                    nodes {
                        name
                        url
                    }
                }
            }
        }
    `;

    const data = await client<{ viewer: ViewerData }>(query);
    return data.viewer;
}

const Test = () => {
    const { accessToken, logout } = useGitHubLogin();
  
    //const [prs, setPRs] = useState<any[]>([]);
    const [login, setLogin] = useState<string | null>(null);
    const [repos, setRepos] = useState<Repo[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        // const fetchPRs = async () => {
        //     const prs = await fetchOpenPRsByAuthors(['erich_adobe']);
        //     setPRs(prs);
        // };

        // const graphqlWithAuth = graphql.defaults({
        //     headers: {
        //         authorization: `token ${accessToken}`,
        //     },
        // });

        // async function fetchOpenPRsByAuthors(authors: string[]) {
        //     const authorClause = authors.map(author => `author:${author}`).join(' OR ');
        //     const queryStr = `is:pr is:open ${authorClause}`;
        //     const { search } = await graphqlWithAuth<{
        //         search: { nodes: any[] }
        //     }>(
        //         `
        //         query($q: String!) {
        //             search(type: ISSUE, query: $q, first: 100) {
        //                 nodes {
        //                     ... on PullRequest {
        //                         title,
        //                         url,
        //                         createdAt,
        //                         repository { nameWithOwner }
        //                         author { login }       
        //                     }
        //                 }
        //             }
        //         }
        //         `,
        //         { q: queryStr }
        //     );
    
        //     return search.nodes;
        // }

        //fetchPRs();
        fetchViewerRepos(accessToken)
            .then(({ login, repositories }) => {
                setLogin(login);
                setRepos(repositories.nodes);
                setTotalCount(repositories.totalCount);
            })
            .catch((err: any) => setError(err.message))
            .finally(() => setLoading(false));
    }, [accessToken]);

    if (loading) return <p>Loading your GitHub repos...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <>
            <h1>Test4</h1>
            <div style={{ padding: '1rem' }}>
            <h1>👤 {login}’s Repositories ({totalCount})</h1>
            <ul>
                {repos.map((r) => (
                <li key={r.name}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer">
                    {r.name}
                    </a>
                </li>
                ))}
            </ul>
            </div>
            <button onClick={logout}>Logout</button>
        </>
    )
}

export default Test;