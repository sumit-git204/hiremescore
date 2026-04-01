const axios = require('axios');

const fetchGitHubStats = async (username) => {
    try {
        // Basic Rate-limit handling can be added later if needed.
        const userUrl = `https://api.github.com/users/${username}`;
        const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100`;

        const [userRes, reposRes] = await Promise.all([
            axios.get(userUrl),
            axios.get(reposUrl)
        ]);

        const userData = userRes.data;
        const reposData = reposRes.data;

        let totalStars = 0;
        const languages = new Set();

        reposData.forEach(repo => {
            totalStars += repo.stargazers_count;
            if (repo.language) {
                languages.add(repo.language);
            }
        });

        return {
            username: userData.login,
            public_repos: userData.public_repos,
            followers: userData.followers,
            total_stars: totalStars,
            languages: Array.from(languages),
            avatar_url: userData.avatar_url
        };
    } catch (error) {
        console.error(`Error fetching GitHub stats for ${username}:`, error.message);
        // Return empty fallback instead of failing completely.
        return {
            username,
            public_repos: 0,
            followers: 0,
            total_stars: 0,
            languages: [],
            error: "Could not fetch GitHub data"
        };
    }
};

module.exports = {
    fetchGitHubStats
};
