import { createContext, useContext, useEffect, useState } from "react";

interface GitHubLoginProps {
    accessToken: string;
    logout: () => void;
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

    useEffect(() => {
        // Parse the URL hash for access token
        if (window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const token = hashParams.get('access_token');
            
            if (token) {
                setAccessToken(token);
                localStorage.setItem('accessToken', token);

                // Clear the hash from the URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
        else {
            const token = localStorage.getItem('accessToken');
            if (token) {
                setAccessToken(token);
            }
        }
        // TODO: Use localStorage to store the access token.        
    }, []);

    const handleGitHubLogin = () => {
        window.location.href = 'https://ubiquitous-baklava-ddca01.netlify.app/.netlify/functions/auth-start';
    };

    const handleLogout = () => {
        setAccessToken(null);
        localStorage.removeItem('accessToken');
    };
    
    // Only provide context value when we have both accessToken and octokit
    const contextValue = accessToken ? { accessToken, logout: handleLogout } : null;

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