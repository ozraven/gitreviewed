import { useEffect, useState } from 'react';
import { useGitHubLogin } from './GitHubLogin';

interface PullRequest {
    title: string;
    html_url: string;
    user: { login: string };
    repository_url: string;
    created_at: string;
    pull_request?: { url: string };
}

// const graphqlWithAuth = graphql.defaults({
//     headers: {
//         authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
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

async function fetchOpenPRsByAuthors(authors: string[], octokit: any) {
    const authorClause = authors.map(author => `author:${author}`).join(' OR ');
    const queryStr = `is:pr is:open ${authorClause}`;
    const response = await octokit.search.issuesAndPullRequests({ queryStr, per_page: 100 });

    return response.data.items
        .filter((item: PullRequest) => !!item.pull_request)
        .map((pr: PullRequest) => ({
            title: pr.title, 
            url: pr.html_url,
            author: pr.user.login,
            repo: pr.repository_url.split('/repos/')[1],
            createdAt: pr.created_at,
        }));
}

const Test = () => {
    const { octokit } = useGitHubLogin();
  
    const [prs, setPRs] = useState<any[]>([]);

    useEffect(() => {
        const fetchPRs = async () => {
            const prs = await fetchOpenPRsByAuthors(['erich_adobe'], octokit);
            setPRs(prs);
        };

        fetchPRs();
    }, [octokit]);

    return (
        <>
            <h1>Test4</h1>
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