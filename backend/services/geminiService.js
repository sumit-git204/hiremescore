const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
let genAI;
let model;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  } else {
    console.warn("GEMINI_API_KEY is not set. Gemini API will fail.");
  }
} catch (error) {
  console.error("Gemini Initialization Error", error);
}

const DEFAULT_RESUME_DATA = {
  skills: [],
  projects: [],
  education: [],
  certifications: [],
  github_link: null,
  coding_profiles: {
    leetcode: null,
    codeforces: null
  },
  experience_years: 0
};

const COMMON_SKILLS = [
  "html", "css", "javascript", "typescript", "react", "next.js", "node.js",
  "express", "mongodb", "mysql", "postgresql", "sql", "python", "java",
  "c", "c++", "firebase", "tailwind", "bootstrap", "redux", "git", "github",
  "docker", "aws", "rest api", "api", "figma", "php", "angular", "vue",
  "machine learning", "data structures", "algorithms"
];

const cleanJsonText = (rawText = "") => {
  let jsonText = rawText.trim();

  if (jsonText.startsWith("```json")) {
    jsonText = jsonText.substring(7);
  } else if (jsonText.startsWith("```")) {
    jsonText = jsonText.substring(3);
  }

  if (jsonText.endsWith("```")) {
    jsonText = jsonText.substring(0, jsonText.length - 3);
  }

  const firstBrace = jsonText.indexOf("{");
  const lastBrace = jsonText.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    jsonText = jsonText.slice(firstBrace, lastBrace + 1);
  }

  return jsonText.trim();
};

const dedupeStrings = (items = []) =>
  [...new Set(items.map((item) => String(item || "").trim()).filter(Boolean))];

const normalizeResumeData = (data = {}) => ({
  ...DEFAULT_RESUME_DATA,
  ...data,
  skills: dedupeStrings(Array.isArray(data.skills) ? data.skills : []),
  projects: Array.isArray(data.projects) ? data.projects.filter(Boolean) : [],
  education: Array.isArray(data.education) ? data.education.filter(Boolean) : [],
  certifications: dedupeStrings(Array.isArray(data.certifications) ? data.certifications : []),
  github_link: data.github_link || null,
  coding_profiles: {
    leetcode: data.coding_profiles?.leetcode || null,
    codeforces: data.coding_profiles?.codeforces || null
  },
  experience_years: Number.isFinite(Number(data.experience_years))
    ? Math.max(0, Math.round(Number(data.experience_years)))
    : 0
});

const extractUrls = (text) => text.match(/https?:\/\/[^\s)]+/gi) || [];

const estimateExperienceYears = (text) => {
  const normalizedText = text.toLowerCase();
  const explicitMatch = normalizedText.match(/(\d+)\+?\s+years?\s+of\s+experience/);
  if (explicitMatch) {
    return Number(explicitMatch[1]);
  }

  const yearMatches = [...text.matchAll(/\b(19|20)\d{2}\b/g)].map((match) => Number(match[0]));
  if (yearMatches.length >= 2) {
    const minYear = Math.min(...yearMatches);
    const maxYear = Math.max(...yearMatches);
    const estimatedYears = maxYear - minYear;
    return estimatedYears > 0 && estimatedYears < 50 ? estimatedYears : 0;
  }

  return 0;
};

const extractSectionLines = (text, sectionName) => {
  const lines = text.split(/\r?\n/).map((line) => line.trim());
  const sectionIndex = lines.findIndex((line) =>
    new RegExp(`^${sectionName}\\b`, "i").test(line)
  );

  if (sectionIndex === -1) {
    return [];
  }

  const collected = [];
  for (let i = sectionIndex + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line) {
      if (collected.length > 0) {
        break;
      }
      continue;
    }

    if (/^[A-Z][A-Za-z\s/&-]{2,}$/.test(line) && collected.length > 0) {
      break;
    }

    collected.push(line.replace(/^[^\w(]+\s*/, ""));
  }

  return collected;
};

const parseResumeTextFallback = (text) => {
  const loweredText = text.toLowerCase();
  const urls = extractUrls(text);

  const detectedSkills = COMMON_SKILLS.filter((skill) => loweredText.includes(skill));
  const skillsSection = extractSectionLines(text, "skills");
  const sectionSkills = skillsSection
    .flatMap((line) => line.split(/[|,]/))
    .map((entry) => entry.trim());

  const githubLink = urls.find((url) => /github\.com\//i.test(url)) || null;
  const leetcodeLink = urls.find((url) => /leetcode\.com\//i.test(url)) || null;
  const codeforcesLink = urls.find((url) => /codeforces\.com\//i.test(url)) || null;

  const projectLines = extractSectionLines(text, "projects").slice(0, 4);
  const projects = projectLines.map((line) => ({
    name: line.split(/[:|-]/)[0].trim().slice(0, 80),
    description: line.slice(0, 200)
  })).filter((project) => project.name);

  const educationLines = extractSectionLines(text, "education").slice(0, 3);
  const education = educationLines.map((line) => ({
    degree: line.slice(0, 120),
    institution: "",
    score: ""
  }));

  const certificationLines = extractSectionLines(text, "certifications");

  return normalizeResumeData({
    skills: [...detectedSkills, ...sectionSkills],
    projects,
    education,
    certifications: certificationLines,
    github_link: githubLink,
    coding_profiles: {
      leetcode: leetcodeLink,
      codeforces: codeforcesLink
    },
    experience_years: estimateExperienceYears(text)
  });
};

const parseResumeText = async (text) => {
  if (!model) {
    console.warn("Gemini model unavailable. Falling back to local resume parser.");
    return parseResumeTextFallback(text);
  }

  const prompt = `
    You are an expert AI placement profile analyzer.
    Extract the following structured data from the provided resume text.
    Return ONLY a valid JSON object matching this exact structure, with no markdown formatting or backticks around it:
    {
      "skills": ["skill1", "skill2"],
      "projects": [{"name": "Project Name", "description": "Brief description"}],
      "education": [{"degree": "Degree Name", "institution": "College Name", "score": "CGPA/Percentage if available"}],
      "certifications": ["cert1", "cert2"],
      "github_link": "https://github.com/username (if found, else null)",
      "coding_profiles": {"leetcode": "link or null", "codeforces": "link or null"},
      "experience_years": 0 (total years as integer, estimate based on dates if available)
    }

    Resume Text:
    ${text}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = cleanJsonText(response.text());
    return normalizeResumeData(JSON.parse(jsonText));
  } catch (error) {
    console.error("Error parsing resume with Gemini:", error);
    console.warn("Falling back to local resume parser.");
    return parseResumeTextFallback(text);
  }
};

const generateGapAnalysis = async (parsedSkills, targetRole) => {
  if (!model) return null;
  const prompt = `
    Compare these skills: ${JSON.stringify(parsedSkills)} against the industry standard requirements for a "${targetRole}".
    Return ONLY a valid JSON object matching this structure:
    {
      "missing_skills": [
        {"skill": "Skill Name", "priority": "High|Medium|Low"}
      ],
      "recommended_projects": ["Project 1", "Project 2"]
    }
  `;
  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(cleanJsonText(result.response.text()));
  } catch (error) {
    console.error("Gap Analysis Error", error);
    return null;
  }
};

const optimizeResumeBullets = async (projectsOrExperience) => {
  if (!model || !projectsOrExperience || projectsOrExperience.length === 0) return null;
  const prompt = `
    Identify weak bullet points in this experience data: ${JSON.stringify(projectsOrExperience)}.
    Rewrite the 3 weakest points using the Google XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z].'
    Return ONLY a valid JSON object matching this structure:
    {
      "improvements": [
        { "original": "old text", "optimized": "new text using XYZ formula" }
      ]
    }
  `;
  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(cleanJsonText(result.response.text()));
  } catch (error) {
    console.error("Resume Optimizer Error", error);
    return null;
  }
};

const generateCareerRoadmap = async (targetRole, gapAnalysis) => {
  if (!model || !gapAnalysis) return null;
  const prompt = `
    Create a 4-week sprint plan to become placement-ready for a "${targetRole}", given these missing skills: ${JSON.stringify(gapAnalysis.missing_skills)}.
    Return ONLY a valid JSON object matching this schema:
    {
      "roadmap": [
        { "week": 1, "theme": "Theoretical foundations", "task": "detailed task" },
        { "week": 2, "theme": "Mini-project", "task": "detailed task" },
        { "week": 3, "theme": "Portfolio enhancement", "task": "detailed task" },
        { "week": 4, "theme": "Mock Interview Prep", "task": "detailed task" }
      ]
    }
  `;
  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(cleanJsonText(result.response.text()));
  } catch (error) {
    console.error("Career Roadmap Error", error);
    return null;
  }
};

module.exports = {
  parseResumeText,
  generateGapAnalysis,
  optimizeResumeBullets,
  generateCareerRoadmap
};
