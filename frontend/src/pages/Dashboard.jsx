import { useState } from 'react';
import { Activity, Code, Star, UploadCloud, Loader2, CheckCircle2, Target } from 'lucide-react';
import { uploadResumeAPI, fetchGithubAnalysisAPI } from '../utils/api';
import SkillRadarChart from '../components/RadarChart';
import MissingSkillsCard from '../components/MissingSkillsCard';
import ResumeOptimizer from '../components/ResumeOptimizer';
import CareerRoadmap from '../components/CareerRoadmap';

const ROLES = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "DevOps Engineer",
    "Product Manager",
    "UI/UX Designer"
];

const Dashboard = ({ user }) => {
    const [file, setFile] = useState(null);
    const [githubUser, setGithubUser] = useState('');
    const [targetRole, setTargetRole] = useState(ROLES[0]);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    const [parsedData, setParsedData] = useState(null);
    const [scoreData, setScoreData] = useState(null);
    const [insights, setInsights] = useState(null);
    const [error, setError] = useState(null);

    const handleFileUpload = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setUploading(true);
        setError(null);

        try {
            const result = await uploadResumeAPI(selectedFile);
            setParsedData(result.data);
        } catch (err) {
            setError(
                err?.response?.data?.details ||
                err?.response?.data?.error ||
                "Failed to parse resume. Please upload a valid PDF."
            );
        } finally {
            setUploading(false);
        }
    };

    const handleGithubConnect = async () => {
        if (!githubUser) {
            setError("Please enter a GitHub username");
            return;
        }
        if (!parsedData) {
            setError("Please upload and parse a resume first.");
            return;
        }

        setAnalyzing(true);
        setError(null);

        try {
            const result = await fetchGithubAnalysisAPI(githubUser, parsedData, targetRole);
            setScoreData(result);
            setInsights(result.insights);
        } catch (err) {
            setError("Failed to analyze profile. Check backend logs.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-green/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            <header className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, {user?.displayName?.split(' ')[0] || "User"}</h1>
                    <p className="text-gray-400">Analyze your resume and GitHub profile to generate your placement readiness score.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg max-w-md text-sm">
                        {error}
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 space-y-6">

                    {/* Target Role Selector */}
                    <div className="glass-card p-6 flex flex-col md:flex-row md:items-center gap-4 border-l-4 border-neon-blue">
                        <div className="flex items-center gap-2 text-white font-medium min-w-[150px]">
                            <Target className="text-neon-blue" size={20} />
                            <span>Target Role:</span>
                        </div>
                        <select
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            disabled={analyzing || scoreData}
                            className="flex-1 bg-dark-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue transition-colors appearance-none"
                        >
                            {ROLES.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    <div className={`glass-card p-6 flex flex-col items-center justify-center border-dashed border-2 transition-colors relative overflow-hidden min-h-[200px] ${parsedData ? 'border-neon-green/50 bg-neon-green/5' : 'border-gray-700 hover:border-neon-green/50 cursor-pointer'}`}>

                        <input
                            type="file"
                            accept=".pdf"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={handleFileUpload}
                            disabled={uploading || parsedData}
                        />

                        {uploading ? (
                            <div className="flex flex-col items-center">
                                <Loader2 size={32} className="text-neon-green animate-spin mb-4" />
                                <h3 className="text-lg font-medium text-white mb-1">AI parsing resume...</h3>
                                <p className="text-sm text-gray-400">Extracting skills, projects, and experience</p>
                            </div>
                        ) : parsedData ? (
                            <div className="flex flex-col items-center text-center z-20">
                                <CheckCircle2 size={40} className="text-neon-green mb-3" />
                                <h3 className="text-xl font-bold text-white mb-1">Resume Analyzed successfully</h3>
                                <p className="text-sm text-gray-300">File: {file?.name}</p>
                                <div className="mt-4 flex flex-wrap justify-center gap-2">
                                    {parsedData.skills && parsedData.skills.slice(0, 5).map(skill => (
                                        <span key={skill} className="px-2 py-1 text-xs rounded bg-dark-900 border border-gray-700">{skill}</span>
                                    ))}
                                    {parsedData.skills?.length > 5 && <span className="px-2 py-1 text-xs rounded bg-dark-900 border border-gray-700">+{parsedData.skills.length - 5} more</span>}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center group pointer-events-none">
                                <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <UploadCloud size={32} className="text-neon-green" />
                                </div>
                                <h3 className="text-lg font-medium text-white mb-1">Upload Resume (PDF)</h3>
                                <p className="text-sm text-gray-400">Drag and drop or click to browse</p>
                            </div>
                        )}
                    </div>

                    <div className={`glass-card p-6 ${!parsedData ? 'opacity-50 pointer-events-none' : ''}`}>
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                            <Code className="text-neon-blue" />
                            Connect GitHub Phase
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">Required to calculate your final HireMeScore.</p>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="GitHub Username"
                                value={githubUser}
                                onChange={(e) => setGithubUser(e.target.value)}
                                className="flex-1 bg-dark-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors"
                                disabled={analyzing || scoreData}
                            />
                            <button
                                onClick={handleGithubConnect}
                                className="bg-neon-blue/10 flex items-center gap-2 text-neon-blue border border-neon-blue/50 px-6 py-2 rounded-lg font-medium hover:bg-neon-blue/20 transition-colors disabled:opacity-50"
                                disabled={analyzing || !githubUser || scoreData}
                            >
                                {analyzing ? <Loader2 size={18} className="animate-spin" /> : "Analyze"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-6 flex flex-col items-center relative overflow-hidden">
                        {scoreData && (
                            <div className="absolute top-0 right-0 p-4 opacity-10 blur-xl">
                                <div className="w-32 h-32 bg-neon-green rounded-full"></div>
                            </div>
                        )}

                        <h3 className="text-lg font-medium text-gray-300 mb-6 w-full font-mono uppercase tracking-wider text-sm z-10">HireMeScore</h3>

                        <div className="relative w-48 h-48 flex items-center justify-center mb-6 z-10">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="96" cy="96" r="80" className="stroke-gray-800" strokeWidth="16" fill="none" />
                                {scoreData && (
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="80"
                                        className="stroke-neon-green drop-shadow-[0_0_10px_rgba(0,255,204,0.5)] transition-all duration-1000 ease-out"
                                        strokeWidth="16"
                                        fill="none"
                                        strokeDasharray="502"
                                        strokeDashoffset={502 - (502 * scoreData.score.total) / 100}
                                    />
                                )}
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-bold text-white neon-text">
                                    {scoreData ? scoreData.score.total : '--'}
                                </span>
                                <span className="text-sm text-gray-400 mt-1">/ 100</span>
                            </div>
                        </div>

                        <p className="text-center text-sm text-gray-400 z-10">
                            {scoreData ? "Your profile analysis is complete. Check details below." : "Upload your resume and connect GitHub to generate your score."}
                        </p>
                    </div>

                    <div className="glass-card p-5">
                        <h4 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Score Breakdown</h4>
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <Star size={18} className="text-yellow-500" />
                                <span className="text-sm text-gray-300">Resume Quality</span>
                            </div>
                            <span className="font-mono text-sm font-bold">{scoreData ? scoreData.score.breakdown.resume_quality : '--'} <span className="text-gray-500 font-normal">/ 30</span></span>
                        </div>

                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <Activity size={18} className="text-neon-blue" />
                                <span className="text-sm text-gray-300">GitHub Activity</span>
                            </div>
                            <span className="font-mono text-sm font-bold">{scoreData ? scoreData.score.breakdown.github_activity : '--'} <span className="text-gray-500 font-normal">/ 40</span></span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Code size={18} className="text-neon-green" />
                                <span className="text-sm text-gray-300">Technical Skills</span>
                            </div>
                            <span className="font-mono text-sm font-bold">{scoreData ? scoreData.score.breakdown.technical_skills : '--'} <span className="text-gray-500 font-normal">/ 30</span></span>
                        </div>

                        {scoreData && <SkillRadarChart scoreData={scoreData.score} />}
                    </div>
                </div>
            </div>

            {/* AI Insights Section (Phase 2) */}
            {insights && (
                <div className="mt-8 animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px bg-gray-800 flex-1"></div>
                        <h2 className="text-2xl font-bold text-white uppercase tracking-widest text-center neon-text">Actionable Intelligence</h2>
                        <div className="h-px bg-gray-800 flex-1"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <MissingSkillsCard gapAnalysis={insights.gapAnalysis} />
                            <ResumeOptimizer optimizations={insights.resumeOptimizer} />
                        </div>
                        <div>
                            <CareerRoadmap roadmapData={insights.careerRoadmap} targetRole={targetRole} />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Dashboard;
