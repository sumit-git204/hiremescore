const { fetchGitHubStats } = require('../services/githubService');
const { calculateScore } = require('../services/scoringService');
const { generateGapAnalysis, optimizeResumeBullets, generateCareerRoadmap } = require('../services/geminiService');

const analyzeGitHubAndGenerateScore = async (req, res) => {
    try {
        const { username, parsedResume, targetRole } = req.body;

        if (!username || !parsedResume || !targetRole) {
            return res.status(400).json({ error: "GitHub username, parsed resume data, and target role are required" });
        }

        // 1. Fetch GitHub Stats
        const githubData = await fetchGitHubStats(username);

        // 2. Generate Initial HireMeScore
        const scoreResult = calculateScore(parsedResume, githubData);

        // 3. Generate Actionable AI Insights in Parallel
        const [gapAnalysis, resumeOptimizer] = await Promise.all([
            generateGapAnalysis(parsedResume.skills || [], targetRole),
            optimizeResumeBullets(parsedResume.experience || parsedResume.projects || [])
        ]);

        // 4. Generate Career Roadmap based on the gap analysis
        let careerRoadmap = null;
        if (gapAnalysis) {
            careerRoadmap = await generateCareerRoadmap(targetRole, gapAnalysis);
        }

        res.status(200).json({
            message: "Analysis complete",
            github: githubData,
            score: scoreResult,
            insights: {
                gapAnalysis,
                resumeOptimizer,
                careerRoadmap
            }
        });

    } catch (error) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: "Failed to generate score and insights", details: error.message });
    }
};

module.exports = {
    analyzeGitHubAndGenerateScore
};
