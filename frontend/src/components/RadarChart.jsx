import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const SkillRadarChart = ({ scoreData }) => {
    if (!scoreData) return null;

    // Transform raw scores into chart data
    // Base off 100 max for each axis
    const maxResume = 30;
    const maxGithub = 40;
    const maxSkills = 30;

    const data = [
        {
            subject: 'Documentation',
            A: Math.round((scoreData.breakdown.resume_quality / maxResume) * 100),
            benchmark: 80,
        },
        {
            subject: 'Coding Consistency',
            A: Math.round((scoreData.breakdown.github_activity / maxGithub) * 100),
            benchmark: 85,
        },
        {
            subject: 'Technical Depth',
            A: Math.round((scoreData.breakdown.technical_skills / maxSkills) * 100),
            benchmark: 90,
        },
        {
            subject: 'Role Alignment',
            A: scoreData.total, // Total score as a proxy for alignment
            benchmark: 75,
        },
        {
            subject: 'Problem Solving',
            A: Math.round(((scoreData.breakdown.technical_skills + scoreData.breakdown.github_activity) / 70) * 100),
            benchmark: 80,
        },
    ];

    return (
        <div className="w-full h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Your Profile" dataKey="A" stroke="#00ffcc" fill="#00ffcc" fillOpacity={0.3} />
                    <Radar name="Industry Benchmark" dataKey="benchmark" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                        itemStyle={{ color: '#00ffcc' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SkillRadarChart;
