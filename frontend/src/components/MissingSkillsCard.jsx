import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const MissingSkillsCard = ({ gapAnalysis }) => {
    if (!gapAnalysis || !gapAnalysis.missing_skills) return null;

    return (
        <div className="glass-card p-6 border-l-4 border-l-red-500">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="text-red-500" />
                Critical Skill Gaps
            </h3>
            <p className="text-sm text-gray-400 mb-6">AI analysis shows you are missing these key skills for your target role.</p>

            <div className="space-y-4">
                {gapAnalysis.missing_skills.map((skillObj, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-gray-800 pb-3 last:border-0">
                        <span className="text-gray-200 font-medium">{skillObj.skill}</span>
                        <span className={`px-2 py-1 text-xs rounded-full font-bold ${skillObj.priority.toLowerCase() === 'high' ? 'bg-red-500/20 text-red-400' :
                                skillObj.priority.toLowerCase() === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-blue-500/20 text-blue-400'
                            }`}>
                            {skillObj.priority} Priority
                        </span>
                    </div>
                ))}
            </div>

            {gapAnalysis.recommended_projects && gapAnalysis.recommended_projects.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                    <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                        <Info size={16} className="text-neon-blue" />
                        Recommended Projects to Build
                    </h4>
                    <ul className="space-y-2">
                        {gapAnalysis.recommended_projects.map((project, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                                <CheckCircle2 size={16} className="text-neon-green mt-0.5 shrink-0" />
                                <span>{project}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MissingSkillsCard;
