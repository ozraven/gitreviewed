import { createContext, useContext, useEffect, useState } from "react";
import { Octokit } from '@octokit/rest';

interface GitHubLoginProps {
    accessToken: string;
    octokit: Octokit;
}

const GitHubLoginContext = createContext<GitHubLoginProps | null>(null);

export function useGitHubLogin(): GitHubLoginProps {
    const context = useContext(GitHubLoginContext);
    if (!context) {
        throw new Error('useGitHubLogin must be used within a GitHubLogin');
    }

    return context;
}

export const GitHubLogin = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [octokit, setOctokit] = useState<Octokit | null>(null);
    
    useEffect(() => {
        // Parse the URL hash for access token
        if (window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const token = hashParams.get('access_token');
            
            if (token) {
                setAccessToken(token);
                
                // Clear the hash from the URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }, []);

    // Update Octokit instance when access token changes
    useEffect(() => {
        if (accessToken) {
            setOctokit(new Octokit({ auth: accessToken }));
        } else {
            setOctokit(null);
        }
    }, [accessToken]);

    const handleGitHubLogin = () => {
        window.location.href = 'https://ubiquitous-baklava-ddca01.netlify.app/.netlify/functions/auth-start';
    };

    // Only provide context value when we have both accessToken and octokit
    const contextValue = accessToken && octokit ? { accessToken, octokit } : null;

    return (
        <GitHubLoginContext.Provider value={contextValue}>
            {contextValue ? (
                <>{children}</>
            ) : (
                <button onClick={handleGitHubLogin}>Login with GitHub</button>
            )}
        </GitHubLoginContext.Provider>
    );
};