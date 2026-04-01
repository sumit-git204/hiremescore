import { Calendar, Map, CheckCircle2 } from 'lucide-react';

const CareerRoadmap = ({ roadmapData, targetRole }) => {
    if (!roadmapData || !roadmapData.roadmap || roadmapData.roadmap.length === 0) return null;

    return (
        <div className="glass-card p-6 mt-6 border-l-4 border-neon-blue">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Map className="text-neon-blue" />
                Your 4-Week Career Sprint
            </h3>
            <p className="text-sm text-gray-400 mb-8">A personalized, actionable roadmap to become a highly hirable <span className="text-neon-blue font-bold">{targetRole}</span>.</p>

            <div className="relative border-l-2 border-gray-700 ml-4 space-y-8">
                {roadmapData.roadmap.map((week, idx) => (
                    <div key={idx} className="relative pl-6">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-dark-900 border-2 border-neon-blue flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-neon-blue"></div>
                        </div>

                        <h4 className="flex items-center gap-2 text-neon-blue font-bold text-sm mb-1 uppercase tracking-wider">
                            <Calendar size={14} /> Week {week.week}: {week.theme}
                        </h4>
                        <div className="bg-dark-800/50 border border-gray-800 rounded-lg p-4 mt-2 hover:border-neon-blue/30 transition-colors">
                            <p className="text-sm text-gray-300 leading-relaxed">{week.task}</p>
                        </div>
                    </div>
                ))}

                {/* End of timeline marker */}
                <div className="relative pl-6 pt-4">
                    <div className="absolute -left-[14px] top-4 w-7 h-7 rounded-full bg-neon-green/20 border-2 border-neon-green flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-neon-green" />
                    </div>
                    <h4 className="text-neon-green font-bold text-sm uppercase tracking-wider mt-1">Ready for Interviews</h4>
                </div>
            </div>
        </div>
    );
};

export default CareerRoadmap;
