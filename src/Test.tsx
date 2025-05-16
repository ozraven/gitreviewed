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