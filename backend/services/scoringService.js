const calculateScore = (resumeData, githubData) => {
    // Goal:
    // Resume Quality = 30%
    // GitHub Activity = 40%
    // Skills = 30%

    let resumeScore = 0;
    let githubScore = 0;
    let skillsScore = 0;

    // 1. Resume Quality (max 30)
    if (resumeData.projects && resumeData.projects.length > 0) {
        resumeScore += Math.min(10, resumeData.projects.length * 5); // 10 pts max
    }
    if (resumeData.education && resumeData.education.length > 0) {
        resumeScore += 10; // Basic existence gives 10
    }
    if (resumeData.experience_years > 0) {
        resumeScore += Math.min(10, resumeData.experience_years * 5); // 10 pts max
    } else if (resumeData.certifications && resumeData.certifications.length > 0) {
        resumeScore += 5; // fallback
    }

    // 2. GitHub Activity (max 40)
    if (githubData && githubData.public_repos !== undefined) {
        githubScore += Math.min(15, githubData.public_repos * 2); // 15 pts max
        githubScore += Math.min(15, (githubData.total_stars || 0) * 3); // 15 pts max
        if (githubData.languages && githubData.languages.length > 0) {
            githubScore += Math.min(10, githubData.languages.length * 3); // 10 pts max
        }
    }

    // 3. Technical Skills (max 30)
    if (resumeData.skills && resumeData.skills.length > 0) {
        skillsScore += Math.min(20, resumeData.skills.length * 2); // 20 pts max
    }
    if (resumeData.coding_profiles && (resumeData.coding_profiles.leetcode || resumeData.coding_profiles.codeforces)) {
        skillsScore += 10; // 10 pts if coding profiles exist
    }

    const totalScore = Math.floor(resumeScore + githubScore + skillsScore);

    return {
        total: totalScore,
        breakdown: {
            resume_quality: resumeScore,
            github_activity: githubScore,
            technical_skills: skillsScore
        }
    };
};

module.exports = {
    calculateScore
};
